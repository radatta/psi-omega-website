#!/bin/bash
# PreToolUse hook on Write|Edit — denies editing repo files while HEAD is on a
# protected/deploy branch (main/master/dev). Branch first: edits there can't be
# pushed (push from a protected branch is blocked) and risk a deploy.
#
# Fails OPEN (allows) if the branch can't be determined, git is unavailable, or
# the file is outside the repo (scratchpad / tmp edits are never blocked).

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // ""')
[ -z "$FILE_PATH" ] && exit 0

REPO_ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
BRANCH=$(cd "$REPO_ROOT" && git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")
[ -z "$BRANCH" ] && exit 0

case "$BRANCH" in
  main|master|dev) ;;
  *) exit 0 ;;
esac

# Only guard files inside the repo — leave scratchpad / tmp edits alone.
TOPLEVEL=$(cd "$REPO_ROOT" && git rev-parse --show-toplevel 2>/dev/null || echo "$REPO_ROOT")
case "$FILE_PATH" in
  "$TOPLEVEL"/*) ;;
  *) exit 0 ;;
esac

jq -n --arg branch "$BRANCH" '{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": ("You are on `" + $branch + "` — a protected/deploy branch. Create a feature branch BEFORE editing: `git fetch origin main && git switch -c feature/<name> origin/main` (carries your working changes onto it), then redo the edit. Edits here cannot be pushed and risk a deploy.")
  }
}'
