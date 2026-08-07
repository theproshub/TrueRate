# Droplet job runner — design

**Date:** 2026-08-07
**Status:** Approved design, pending implementation plan

## Problem

Three scheduled jobs run as Vercel cron routes:

| Job | Schedule | Writes | Idempotent |
|-----|----------|--------|------------|
| `sync-cbl` | `5 6 * * *` | `cbl_series` (upsert on `mnemonic`), `cbl_observations` (upsert on `mnemonic,period_date`) | Yes |
| `snapshot-quotes` | `30 22 * * *` | `quotes_daily` (upsert on `symbol_id,date`) | Yes |
| `generate-feed` | `0 6 * * *` | `content_cards`, `markets_snapshot`, `generation_log` (plain `insert`) | **No** |

`sync-cbl` scrapes ~366 series from `app.datawarehousepro.com` at concurrency 8 and is
pinned to `maxDuration = 300`, the Vercel Pro ceiling. It has no headroom as the catalog
grows, and heavier work (headless Chrome, ffmpeg reels, PDF parsing of CBL releases) has
nowhere to run at all.

A DigitalOcean droplet now exists. It should absorb the batch compute.

## Scope

**In:** the three cron jobs move to the droplet; a shared job module is extracted so the
Vercel routes and the droplet run identical code.

**Out, deliberately:**

- `truerate-mcp` stays on Supabase edge functions. It works, it is HTTPS-ready, and
  moving it means owning TLS and uptime for every Claude session.
- The Next.js site stays on Vercel. Self-hosting forfeits the CDN, ISR, preview
  deploys, and image optimization.
- No reverse proxy, no inbound ports beyond SSH.

## Architecture

### Box layout

- Ubuntu LTS, hardened before anything else: non-root `julian` with sudo, key-only SSH
  (`PermitRootLogin no`, `PasswordAuthentication no` via
  `/etc/ssh/sshd_config.d/99-hardening.conf`), `ufw` allowing OpenSSH only, `fail2ban`,
  `unattended-upgrades`.
  On Ubuntu 24.04+ ssh is socket-activated — apply with
  `systemctl daemon-reload && systemctl restart ssh.socket`, then confirm with
  `sshd -T | grep -E 'permitrootlogin|passwordauthentication'`. Keep the root session
  open until a `julian@IP` login succeeds in a second terminal.
- Dedicated `truerate` system user owns the deployment. Jobs run as it, not as `julian`.
- Repo at `/srv/truerate`, tracking `develop` (the production branch).
- Node 24 LTS from nodesource.
- Docker installed, but **only for third-party images** (Uptime Kuma and similar).
  TrueRate's own jobs are native systemd units — they share `src/lib/jobs/*` with the
  Next.js app, and a container would force an image rebuild for every one-line change.
  Note that Docker publishes container ports past `ufw`; bind third-party services to
  `127.0.0.1` rather than `0.0.0.0`.

### Secrets

`/etc/truerate/env`, owned `root:truerate`, mode `0640`, referenced by each unit's
`EnvironmentFile=`. Never a `.env.local` inside the repo — the checkout is replaced on
every deploy and a stray env file there is one `git clean` from being lost, or one
mispermission from being world-readable.

Required keys: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`,
`TRUERATE_SITE_URL` (for revalidation callbacks), `JOB_ALERT_WEBHOOK_URL` (failure
notifications).

### Extracting the job logic

The logic currently lives inside route handlers that import `@/lib/supabase/admin` and
`next/cache`. `revalidatePath` only exists inside the Next runtime, so the handlers
cannot be executed directly on the droplet.

Each job moves to `src/lib/jobs/<job>.ts`, exporting a plain async function that takes no
Next-specific input and returns a result object. Constraints on these modules:

- No imports from `next/*`.
- No `revalidatePath`. Cache invalidation is the caller's job.

Two callers consume each module:

1. **Vercel route handler** — shrinks to an auth check, a call to the job function, the
   existing `revalidatePath(...)` calls, and a JSON response.
2. **Droplet runner** — `src/lib/jobs/run.ts`, dispatching on `process.argv[2]`. After a
   successful run it POSTs to the site's existing `/api/revalidate` with
   `Authorization: Bearer ${CRON_SECRET}` and the relevant tags. That endpoint already
   accepts `rates`, `indicators`, `commodities`, `articles`, and `feed`.

`createAdminClient` needs no change — it reads `process.env` directly and its only import
is a type-only one, so it already runs outside Next.

**Runner:** `tsx`, added to `dependencies` (not `devDependencies`, so
`npm ci --omit=dev` still installs it). Node 24's native type stripping was considered
and rejected: it does no extension resolution, so it would force explicit `.ts`
extensions on every relative import and break the `@/` alias the rest of the app uses.
Invocation is `npx tsx src/lib/jobs/run.ts <job>`.

### Scheduling

One `truerate-<job>.service` (`Type=oneshot`, `User=truerate`,
`WorkingDirectory=/srv/truerate`, `EnvironmentFile=/etc/truerate/env`) plus one
`truerate-<job>.timer` (`OnCalendar=`, `Persistent=true` so a reboot does not silently
skip a run) per job. No duration cap — `sync-cbl` runs to completion.

### Deploy

`scripts/deploy.sh`, run as `truerate`:

```
git fetch origin && git reset --hard origin/develop && npm ci --omit=dev
```

`reset --hard` rather than `pull` so a dirty checkout cannot wedge a deploy.

### Transition

Vercel crons stay live. Idempotency decides how each job crosses over:

- `sync-cbl` and `snapshot-quotes` upsert, so both schedulers may run them. Offset the
  droplet timers by roughly an hour and compare results across a few days.
- `generate-feed` plainly inserts. Running it in both places duplicates social cards, so
  it stays Vercel-only until an explicit cutover: remove its entry from `vercel.ts` in
  the same commit that enables its timer.

### Observability

- journald per unit (`journalctl -u truerate-sync-cbl -f`), with `SystemMaxUse=500M` in
  `/etc/systemd/journald.conf` so logs cannot fill a small disk.
- Each job records its outcome with a `source` field (`'droplet'` or `'vercel'`) so a
  parallel-run discrepancy is attributable.
- A single `truerate-alert@.service` template, referenced as
  `OnFailure=truerate-alert@%n.service` by every job unit, POSTs the failed unit name and
  its last journal lines to `JOB_ALERT_WEBHOOK_URL` from `/etc/truerate/env`. A silently
  failing timer is the main operational risk of this design, so this is not optional.

## Success criteria

1. `sync-cbl` completes on the droplet with no duration ceiling, and its row counts match
   a same-day Vercel run.
2. A code change to a job reaches production via `git push` + `deploy.sh`, with no image
   build.
3. `vercel.ts` and the droplet never both run `generate-feed`.
4. A failed timer produces a notification, not silence.

## Host

Ubuntu 26.04 LTS, 1 vCPU / 2 GB RAM, NYC, `192.34.63.217`. Hardened as described above.
Docker present, running Uptime Kuma bound to `127.0.0.1:3001` and reached over an SSH
tunnel.

The 2 GB is shared with Uptime Kuma, so job units set `MemoryHigh=768M` / `MemoryMax=1G`
— a leaking job gets throttled and reclaimed rather than inviting the OOM killer to pick
a victim. The three current jobs are network-bound and nowhere near that. Headless Chrome
work later would want a larger droplet.

## Open items

- Confirm root SSH is actually refused (`ssh root@192.34.63.217` must fail).
- Enable DigitalOcean droplet backups — the box holds no unique state today, but
  `/etc/truerate/env` is not in git.
- Later: evaluate moving the CBL MCP server off Supabase Edge Functions. Out of scope
  here; it means owning TLS and uptime for every Claude session.
