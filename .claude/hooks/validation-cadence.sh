#!/bin/bash
# PreToolUse hook on Bash — validation cadence. When two validation runs land
# <2 min apart (rapid re-validation mid-edit), nudges ONCE that validation is
# best batched: write through the change, then a single pass. Doesn't block.
#
# set -u only; fail-open.

set -u

INPUT=$(cat)
COMMAND=$(printf '%s' "$INPUT" | jq -r '.tool_input.command // ""' 2>/dev/null || echo "")
SESSION_ID=$(printf '%s' "$INPUT" | jq -r '.session_id // "unknown"' 2>/dev/null || echo "unknown")

if printf '%s' "$COMMAND" | grep -qE '(bun|npm|npx) (run )?(check-types|lint|build)'; then
  STATE_DIR="/tmp/psi-omega-website-validation-cadence"
  mkdir -p "$STATE_DIR" 2>/dev/null || true
  SF="$STATE_DIR/$SESSION_ID"
  PREV=$(cat "$SF" 2>/dev/null || echo "0 0")
  LAST=$(printf '%s' "$PREV" | awk '{print $1+0}')
  NUDGED=$(printf '%s' "$PREV" | awk '{print $2+0}')
  NOW=$(date +%s)
  DO_NUDGE=0
  if [ "$NUDGED" -eq 0 ] && [ "$LAST" -gt 0 ] && [ $((NOW - LAST)) -lt 120 ]; then
    DO_NUDGE=1
    NUDGED=1
  fi
  echo "$NOW $NUDGED" > "$SF" 2>/dev/null || true
  if [ "$DO_NUDGE" -eq 1 ]; then
    jq -n '{
      "hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "allow",
        "additionalContext": "You just re-ran validation within 2 min. Prefer writing through the change, then a single pass (bun check-types + bun lint) before committing, rather than re-validating mid-edit. One-time nudge."
      }
    }'
    exit 0
  fi
fi

exit 0
