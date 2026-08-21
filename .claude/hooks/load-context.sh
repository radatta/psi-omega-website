#!/bin/bash
# SessionStart hook — fires once per session (new or resumed). Injects the doc
# index so Claude opens with the map, plus a short git-state briefing so a
# resumed session starts oriented instead of re-deriving where it stands.
#
# set -u only; fail-open everywhere — a session must always be able to start.

set -u

REPO="${CLAUDE_PROJECT_DIR:-$(pwd)}"
INDEX="$REPO/docs/index.md"

CONTENT=""
if [ -f "$INDEX" ]; then
  CONTENT=$(cat "$INDEX")
else
  CONTENT="(No docs/index.md yet — repo documentation is still to be written. Orientation: README.md for the project overview, page content lives in lib/*_data.ts, brother photos in public/images/brothers/.)"
fi

# --- git briefing: computed in a subshell with errexit off so one failing
# check can't abort the hook. ---
BRIEF=$(
  set +e
  cd "$REPO" 2>/dev/null || exit 0
  command -v git >/dev/null 2>&1 || exit 0
  git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0
  B=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
  printf '\n\n---\n\nGit state at session start:\nbranch: %s\n' "${B:-unknown}"
  case "$B" in
    main|master|dev)
      printf 'On a protected/deploy branch — branch before editing; commits/pushes here are blocked (they would deploy).\n' ;;
    HEAD|"") : ;;
    *)
      U=$(git rev-list --count '@{u}..HEAD' 2>/dev/null)
      [ -n "$U" ] && [ "$U" != "0" ] && printf 'unpushed commits: %s (push to back up)\n' "$U"
      ;;
  esac
  S=$(git status --short 2>/dev/null)
  if [ -z "$S" ]; then printf 'working tree: clean\n'; else printf 'uncommitted changes:\n%s\n' "$S"; fi
)

COMBINED="$CONTENT$BRIEF"

jq -n --arg content "$COMBINED" '{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": $content
  }
}'
