#!/bin/bash
# UserPromptSubmit hook — computes live git state and injects up to 3 worst-first
# alerts, ONLY when something is off. Silent on a clean, healthy tree. Every ~20
# prompts it re-injects a short re-grounding block to counter long-session drift.
#
# set -u only; every git call fail-open — a failed check must never block a prompt.

set -u

INPUT=$(cat)
SESSION_ID=$(printf '%s' "$INPUT" | jq -r '.session_id // "unknown"' 2>/dev/null || echo "unknown")
REPO="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$REPO" 2>/dev/null || exit 0

g() { git "$@" 2>/dev/null; }

ALERTS=()
BRANCH=$(g rev-parse --abbrev-ref HEAD || echo "")
PORCELAIN=$(g status --porcelain || echo "")

# On a protected/deploy branch — editing/committing/pushing are all blocked here.
case "$BRANCH" in
  main|master|dev)
    ALERTS+=("On \`$BRANCH\` (protected/deploy) — branch before editing: \`git fetch origin main && git switch -c feature/<name> origin/main\`. Commits/pushes here are blocked.") ;;
esac

if [ "$BRANCH" = "HEAD" ]; then
  ALERTS+=("Detached HEAD — not on a branch. \`git switch -c feature/<name>\` to capture work before it's lost.")
fi
if [ -n "$(g ls-files -u || echo "")" ]; then
  ALERTS+=("Unresolved merge conflict in the tree — resolve it before continuing.")
fi

# Uncommitted work past the ~10-min backup cadence.
if [ -n "$PORCELAIN" ]; then
  LAST=$(g log -1 --format=%ct || echo 0)
  NOW=$(date +%s)
  if [ "${LAST:-0}" -gt 0 ] 2>/dev/null; then
    AGE=$(( (NOW - LAST) / 60 ))
    [ "$AGE" -ge 10 ] && ALERTS+=("Uncommitted changes, last commit ${AGE}m ago — commit a WIP save on your feature branch: \`git commit -am 'WIP: ...'\`.")
  fi
fi

# Unpushed commits (only if an upstream is set).
UNPUSHED=$(g rev-list --count @{u}..HEAD 2>/dev/null || echo "")
if [ -n "$UNPUSHED" ] && [ "$UNPUSHED" != "0" ]; then
  ALERTS+=("$UNPUSHED unpushed commit(s) — \`git push\` to back them up remotely.")
fi

# Oversized uncommitted diff.
if [ -n "$PORCELAIN" ]; then
  DIFFLINES=$(g diff HEAD --numstat 2>/dev/null | awk '{a+=$1+$2} END{print a+0}' 2>/dev/null || echo 0)
  [ "${DIFFLINES:-0}" -gt 400 ] 2>/dev/null && ALERTS+=("Uncommitted diff is large (~${DIFFLINES} lines) — commit a logical unit before it grows harder to review.")
fi

# --- turn counter (per session) for periodic re-grounding ---
STATE_DIR="/tmp/psi-omega-website-git-reminder"
mkdir -p "$STATE_DIR" 2>/dev/null || true
STATE_FILE="$STATE_DIR/$SESSION_ID"
TURN=$(cat "$STATE_FILE" 2>/dev/null || echo 0)
case "$TURN" in ''|*[!0-9]*) TURN=0 ;; esac
TURN=$((TURN + 1))
echo "$TURN" > "$STATE_FILE" 2>/dev/null || true

MSG=""
COUNT=${#ALERTS[@]}
if [ "$COUNT" -gt 0 ]; then
  MSG="Git state — attend to these (worst first):"$'\n'
  i=0
  for a in "${ALERTS[@]}"; do
    [ "$i" -ge 3 ] && break
    MSG="${MSG}- ${a}"$'\n'
    i=$((i + 1))
  done
  [ "$COUNT" -gt 3 ] && MSG="${MSG}- (+$((COUNT - 3)) more)"$'\n'
fi

if [ $((TURN % 20)) -eq 0 ]; then
  MSG="${MSG}"$'\n'"Re-grounding (long session): validate with \`bun check-types\` + \`bun lint\`; keep content in \`lib/*_data.ts\` and brother photos in \`public/images/brothers/\`; no secrets or PII in source; justify any new dependency; never commit or push on \`main\`/\`dev\`; consult before big or irreversible actions."
fi

[ -z "$MSG" ] && exit 0

jq -n --arg msg "$MSG" '{
  "continue": true,
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": $msg
  }
}'
exit 0
