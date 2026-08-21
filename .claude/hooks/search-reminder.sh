#!/bin/bash
# Soft PreToolUse reminder fired before WebSearch / WebFetch. Doesn't block.
# Nudges Claude to consider whether the multi-step search-specialist agent is a
# better fit than a one-shot call.

set -euo pipefail

jq -n '{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow",
    "additionalContext": "Reminder: if this is multi-step research (cross-source synthesis, fresh info, version/API verification across multiple lookups), prefer the `search-specialist` agent. If this is a single-fact lookup, proceed."
  }
}'
