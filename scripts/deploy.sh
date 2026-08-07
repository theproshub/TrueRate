#!/usr/bin/env bash
# Droplet deploy. Run as the `truerate` user on the VPS:
#
#   sudo -u truerate /srv/truerate/scripts/deploy.sh
#
# Pulls the deploy branch and installs production dependencies. Does NOT build —
# the droplet runs jobs via tsx, not the Next.js app. Unit files changed in the
# repo still need `sudo systemctl daemon-reload`; this script says so rather
# than escalating privileges itself.

set -euo pipefail

REPO_DIR="${REPO_DIR:-/srv/truerate}"
BRANCH="${DEPLOY_BRANCH:-develop}"

cd "$REPO_DIR"

echo "==> fetching origin/$BRANCH"
git fetch origin "$BRANCH"

BEFORE="$(git rev-parse HEAD)"
# reset --hard, not pull: a dirty checkout on the server should never be able to
# wedge or silently merge into a deploy.
git reset --hard "origin/$BRANCH"
AFTER="$(git rev-parse HEAD)"

echo "==> $BEFORE -> $AFTER"

echo "==> installing dependencies"
npm ci --omit=dev

if ! git diff --quiet "$BEFORE" "$AFTER" -- infra/systemd; then
  echo
  echo "!! Unit files changed in infra/systemd. Reinstall and reload them:"
  echo "   sudo cp $REPO_DIR/infra/systemd/*.service $REPO_DIR/infra/systemd/*.timer /etc/systemd/system/"
  echo "   sudo systemctl daemon-reload"
fi

echo "==> done"
