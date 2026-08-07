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
sudo useradd --system --create-home --home-dir /srv/truerate --shell /usr/sbin/nologin truerate

# Reading a failed unit's journal for the alert body needs this group.
sudo usermod -aG systemd-journal truerate

sudo -u truerate git clone https://github.com/theproshub/TrueRate.git /srv/truerate
cd /srv/truerate && sudo -u truerate git checkout develop
```

For a private repo, give the `truerate` user a read-only deploy key at
`/srv/truerate/.ssh/id_ed25519` and clone over SSH instead.

### 3. Secrets

Never a `.env.local` inside the checkout — `deploy.sh` runs `git reset --hard`,
and an untracked env file there is one bad command from being lost.

```bash
sudo mkdir -p /etc/truerate
sudo tee /etc/truerate/env >/dev/null <<'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
CRON_SECRET=...
TRUERATE_SITE_URL=https://truerateliberia.com
JOB_ALERT_WEBHOOK_URL=...
EOF
sudo chown root:truerate /etc/truerate/env
sudo chmod 640 /etc/truerate/env
```

`CRON_SECRET` must be the same value as in the Vercel project env — the droplet
authenticates to `/api/revalidate` with it. Pull it with `vercel env pull`.

### 4. First deploy

```bash
sudo chmod +x /srv/truerate/scripts/deploy.sh /srv/truerate/infra/systemd/alert.sh
sudo -u truerate /srv/truerate/scripts/deploy.sh
```

### 5. Install the units

```bash
sudo cp /srv/truerate/infra/systemd/*.service /srv/truerate/infra/systemd/*.timer /etc/systemd/system/
sudo systemctl daemon-reload
```

### 6. Cap the journal

A 2GB droplet does not want unbounded logs.

```bash
sudo sed -i 's/^#\?SystemMaxUse=.*/SystemMaxUse=500M/' /etc/systemd/journald.conf
sudo systemctl restart systemd-journald
```

## Verify before scheduling

Run the job by hand and watch it. Do not enable the timer until this passes.

```bash
sudo systemctl start truerate-sync-cbl.service
journalctl -u truerate-sync-cbl -f
```

Expect a `catalog: N series` line, periodic progress, and a final JSON result
with `failed_count` near zero. Then check the exit was clean:

```bash
systemctl show truerate-sync-cbl.service --property=Result --value   # -> success
```

Test the alert path too, since a silent broken alerter is the failure mode that
hides every other failure:

```bash
sudo -u truerate JOB_ALERT_WEBHOOK_URL="$(sudo grep JOB_ALERT_WEBHOOK_URL /etc/truerate/env | cut -d= -f2-)" \
  /srv/truerate/infra/systemd/alert.sh truerate-sync-cbl.service
```

## Enable the timer

```bash
sudo systemctl enable --now truerate-sync-cbl.timer
systemctl list-timers truerate-\*
```

The timer runs at 07:05 UTC, an hour after the Vercel cron at 06:05. Both may
run during verification: the job upserts on `mnemonic` and `mnemonic,period_date`,
so a double run is a no-op.

## Cutting Vercel over

After a few days of matching results, remove the `sync-cbl` entry from
`vercel.ts` and move `OnCalendar` to `06:05`. Keep the route handler — it is the
manual "run it now" button and shares its implementation with the timer.

**`generate-feed` is different.** It uses plain `INSERT` into `content_cards`,
so running it in both places duplicates social cards. It requires a hard
cutover: delete it from `vercel.ts` in the same commit that enables its timer.

## Operating

```bash
journalctl -u truerate-sync-cbl -f              # follow
journalctl -u truerate-sync-cbl --since today   # today's run
systemctl list-timers truerate-\*               # when does it next fire
sudo systemctl start truerate-sync-cbl.service  # run now
sudo -u truerate /srv/truerate/scripts/deploy.sh  # ship a change
```
