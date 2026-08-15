# Droplet job runner — install

Runs TrueRate's scheduled jobs on the DigitalOcean droplet as systemd timers,
escaping Vercel's 300s function ceiling. Design: [`docs/superpowers/specs/2026-08-07-droplet-jobs-design.md`](../../docs/superpowers/specs/2026-08-07-droplet-jobs-design.md).

Docker on this box is for third-party images only (Uptime Kuma). TrueRate's own
jobs run native, so a one-line fix ships with `git push` + `deploy.sh` and no
image rebuild.

## One-time setup

Run as `julian` on the droplet.

### 1. Node 24 and jq

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs jq git
```

### 2. Service user and checkout

The `truerate` user owns the deployment and runs the jobs. It has no login
shell — nothing should ever `ssh` in as it.

```bash
# No --create-home: it would populate /srv/truerate with skel files, and
# `git clone` refuses a non-empty target. Create an empty directory instead.
sudo useradd --system --home-dir /srv/truerate --shell /usr/sbin/nologin truerate
sudo mkdir -p /srv/truerate
sudo chown truerate:truerate /srv/truerate

# Reading a failed unit's journal for the alert body needs this group.
sudo usermod -aG systemd-journal truerate

# Clone `develop` directly with -b. It is the deploy branch and the one
# `deploy.sh` defaults to; a clone of the default branch would leave step 4
# invoking a script that does not exist there.
sudo -u truerate git clone -b develop \
  https://github.com/theproshub/TrueRate.git /srv/truerate
```

The repo is public, so HTTPS needs no credentials. Were it private, the
`truerate` user would need a read-only deploy key at
`/srv/truerate/.ssh/id_ed25519` and an SSH clone URL.

### 3. Secrets

Never a `.env.local` inside the checkout — `deploy.sh` runs `git reset --hard`,
and an untracked env file there is one bad command from being lost.

```bash
sudo mkdir -p /etc/truerate
sudo tee /etc/truerate/env >/dev/null <<'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service role key>
CRON_SECRET=<same value as Vercel production>
TRUERATE_SITE_URL=https://truerateliberia.com
JOB_ALERT_WEBHOOK_URL=<slack or discord webhook>
AI_GATEWAY_API_KEY=<vercel ai gateway key>
EOF
sudo chown root:truerate /etc/truerate/env
sudo chmod 640 /etc/truerate/env
```

**No inline comments.** systemd's `EnvironmentFile` parser only honours `#` at
the start of a line — a trailing `KEY=value   # note` makes the note part of the
value. An API key with a comment glued to it fails authentication while looking
correct in the file.

**Substitute every placeholder.** Pasting this block verbatim produces a job
that fails with `TypeError: fetch failed` against a host that does not exist —
a confusing symptom for an obvious cause.

Verify both at once — the first must print `0`, the second must list all six
names:

```bash
sudo grep -c '<' /etc/truerate/env
sudo grep -oE '^[A-Z_]+' /etc/truerate/env
```

A missing name is silent: each variable is read by a different code path, so an
absent `AI_GATEWAY_API_KEY` only surfaces as `generate-feed` returning
`status: "partial"`, and an absent `JOB_ALERT_WEBHOOK_URL` surfaces as no alert
about it.

`CRON_SECRET` must match **Vercel production**, not preview — `vercel env pull`
defaults to the development/preview environment, and a preview value gets a 401
from the live site. Check with `vercel env ls production`.

`AI_GATEWAY_API_KEY` is needed only by `generate-feed`, and there is **no
existing value to copy**: on Vercel the AI Gateway authenticates through OIDC,
so no such variable exists in the Vercel environment. Mint a fresh key in the
Vercel dashboard under AI Gateway → API Keys.

### 4. First deploy

`deploy.sh` defaults to `develop`, which is what production tracks:

```bash
sudo -u truerate /srv/truerate/scripts/deploy.sh
```

To ship some other branch, override `DEPLOY_BRANCH` — `sudo` resets the
environment, so the variable has to be set with `env` rather than as a bare
prefix:

```bash
sudo -u truerate env DEPLOY_BRANCH=my-branch /srv/truerate/scripts/deploy.sh
```

The scripts are committed mode 755, so no `chmod` is needed.

### 5. Install the units

```bash
sudo cp /srv/truerate/infra/systemd/*.service /srv/truerate/infra/systemd/*.timer /etc/systemd/system/
sudo systemctl daemon-reload
```

### 6. Cap the journal

A 2GB droplet does not want unbounded logs.

A drop-in rather than an edit of `journald.conf`: an in-place `sed` silently
does nothing if the distro ships the key in a different form, leaving logs
uncapped while appearing to have worked.

```bash
sudo mkdir -p /etc/systemd/journald.conf.d
printf '[Journal]\nSystemMaxUse=500M\n' \
  | sudo tee /etc/systemd/journald.conf.d/99-truerate.conf >/dev/null
sudo systemctl restart systemd-journald
journalctl --disk-usage
```

## The jobs

`vercel.ts` declares no crons. These timers are the only thing running these
jobs; the `/api/cron/*` routes remain as authenticated manual triggers sharing
the same implementation from `src/lib/jobs/`.

| Job | Timer | Writes | Re-runnable |
|-----|-------|--------|-------------|
| `sync-cbl` | 06:05 UTC | upsert `cbl_series`, `cbl_observations` | yes |
| `snapshot-quotes` | 22:30 UTC | upsert `quotes_daily` on `(symbol_id, date)` | yes |
| `generate-feed` | 06:00 UTC | **insert** `content_cards`, `markets_snapshot` | **no** |

`generate-feed` is the one to be careful with. It inserts, so a second run
creates duplicate cards. Two things guard it: a 30-minute duplicate check
against `generation_log.run_at`, and `Persistent=false` on its timer so a
missed run is skipped rather than caught up at boot. A missed day is cheaper
than a duplicated one.

## Verify before scheduling

Run each job by hand and confirm it exits clean. Do not enable a timer until
its job has passed once.

```bash
sudo systemctl start truerate-sync-cbl.service
journalctl -u truerate-sync-cbl --no-pager -n 30
systemctl show truerate-sync-cbl.service --property=Result --value   # -> success
```

What a healthy run looks like:

- **`sync-cbl`** — `catalog: N series`, progress every 50, then
  `failed_count: 0` and a non-zero `observations_upserted`. A non-empty
  `sample_errors` names the cause.

  Release detection then logs `index: N existing observations` and
  `releases: N findings, N articles labeled, N findings filed`.

  **`index: N` must equal the row count of `cbl_observations`** (44152 as of
  Aug 2026). The job now throws if it does not, because a partial index makes
  every unread observation look new: a run that indexed 1000 of 44152 rows
  emitted 43024 false `new_period` findings and flagged all 45 tagged articles.
  PostgREST silently caps a page at its own `max-rows`, so the loader advances
  by rows actually returned and verifies the total before diffing.

  Zero findings on a day CBL published nothing is correct. `WARN index load
  failed` or `index incomplete` means the sync ran but could not report
  changes — the run is marked degraded and alerts.
- **`snapshot-quotes`** — `fx: N quotes` and `commodities: N quotes`, then
  `ok: true` with `rows_written` > 0. `ok: false` means every live feed was
  unusable and nothing was written.
- **`generate-feed`** — a line per card type, then `status: "success"`.
  `"partial"` means at least one generator failed and is treated as a failure.
  `skipped: true` means the 30-minute guard fired, which is correct behaviour.

Test the alert path too, since a silently broken alerter is the failure mode
that hides every other failure:

```bash
sudo -u truerate env \
  JOB_ALERT_WEBHOOK_URL="$(sudo grep '^JOB_ALERT_WEBHOOK_URL=' /etc/truerate/env | cut -d= -f2-)" \
  /srv/truerate/infra/systemd/alert.sh truerate-sync-cbl.service
```

## Enable the timers

```bash
sudo systemctl enable --now truerate-sync-cbl.timer
sudo systemctl enable --now truerate-snapshot-quotes.timer
sudo systemctl enable --now truerate-generate-feed.timer
systemctl list-timers 'truerate-*'
```

## Operating

```bash
journalctl -u truerate-sync-cbl -f                  # follow one job
journalctl -u 'truerate-*' --since today            # all jobs today
systemctl list-timers 'truerate-*'                  # next fire times
sudo systemctl start truerate-sync-cbl.service      # run now
sudo -u truerate /srv/truerate/scripts/deploy.sh    # ship a change
```
