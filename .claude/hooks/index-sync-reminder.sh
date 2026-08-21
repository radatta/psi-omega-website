#!/bin/bash
# PreToolUse tripwire on Write|Edit — when a NEW markdown doc is created under
# docs/, remind Claude to add its entry to docs/index.md in the same change.
# Non-blocking: it flags (and allows the write). Silent on edits to existing
# docs and on the index itself.

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // ""')

case "$FILE_PATH" in
  *docs/*.md) ;;
  *) exit 0 ;;
esac

REL="${FILE_PATH#*docs/}"
[ "$REL" = "index.md" ] && exit 0
[ -f "$FILE_PATH" ] && exit 0    # already exists -> an edit, not a new doc

jq -n --arg rel "docs/$REL" '{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow",
    "additionalContext": ("New doc being created (" + $rel + "). Add its one-line entry to docs/index.md in this same change — a doc missing from the index is undiscoverable. Ignore if you already updated the index this turn.")
  }
}'
