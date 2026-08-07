#!/usr/bin/env bash
# Failure alert for a TrueRate systemd job.
#
# Invoked by truerate-alert@.service via OnFailure=. Argument is the failed
# unit name (systemd's %n), e.g. truerate-sync-cbl.service.
#
# Posts to JOB_ALERT_WEBHOOK_URL (Slack- or Discord-shaped: a JSON body with a
# "text"/"content" field). A missing webhook is logged, not fatal — failing the
# alerter on top of a failed job just doubles the noise in the journal.

set -uo pipefail

UNIT="${1:-unknown.service}"
HOST="$(hostname)"

# Exit status and timing straight from systemd, plus the tail of the job's log.
STATUS="$(systemctl show "$UNIT" --property=Result --value 2>/dev/null || echo unknown)"
LOG="$(journalctl -u "$UNIT" -n 30 --no-pager --output=cat 2>/dev/null || echo '(journal unreadable — is the truerate user in the systemd-journal group?)')"

MESSAGE="TrueRate job failed: ${UNIT} on ${HOST} (result=${STATUS})

${LOG}"

if [[ -z "${JOB_ALERT_WEBHOOK_URL:-}" ]]; then
  echo "JOB_ALERT_WEBHOOK_URL unset — alert not delivered. Failure was:"
  echo "$MESSAGE"
  exit 0
fi

# jq -Rs handles the newlines and quotes in the log tail correctly; hand-rolled
# escaping here would break on the first quote in a stack trace.
BODY="$(jq -Rs '{text: ., content: .}' <<<"$MESSAGE")"

curl --silent --show-error --fail --max-time 15 \
  -X POST \
  -H 'content-type: application/json' \
  --data "$BODY" \
  "$JOB_ALERT_WEBHOOK_URL" \
  || echo "alert delivery failed for $UNIT"
