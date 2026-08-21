#!/bin/bash
# PreToolUse hook on Bash — DENIES destructive commands before they run. The one
# hook that hard-blocks rather than reminds; the last line of defense for
# unattended / skip-permissions runs where there are no approval prompts.
#
# Blocks:
#  - rm -rf (recursive force-delete on the filesystem)
#  - git reset --hard / git clean -f* / git branch -D (irrecoverable work/branch loss)
#  - git push --force / --force-with-lease / -f, git push --delete (rewrites/destroys remote)
#  - git push to a protected/deploy branch (main/master/dev) — by current branch OR explicit target
#  - gh auth login/refresh/token/setup-git (never manage credentials autonomously)
#  - raw curl/wget against api.github.com (use `gh`)
#
# Complements the OS sandbox (which protects the host + watches for exfil): this
# protects the source tree, in-progress work, and git history/remote from
# normal-but-destructive git commands the sandbox treats as ordinary dev activity.

set -euo pipefail

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // ""')

deny() {
  jq -n --arg reason "$1" '{
    "hookSpecificOutput": {
      "hookEventName": "PreToolUse",
      "permissionDecision": "deny",
      "permissionDecisionReason": $reason
    }
  }'
  exit 0
}

# Recursive force-delete.
if echo "$COMMAND" | grep -qE '\brm[[:space:]]+-([a-zA-Z]*r[a-zA-Z]*f|[a-zA-Z]*f[a-zA-Z]*r)\b'; then
  deny "\`rm -rf\` is blocked. Confirm before removing files recursively. For tracked files use \`git restore\`; for one file drop the -r."
fi

# Destructive git: hard reset.
if echo "$COMMAND" | grep -qE '\bgit[[:space:]]+reset[[:space:]]+--hard\b'; then
  deny "\`git reset --hard\` is blocked — it loses uncommitted work irrecoverably. Use \`git stash\`, or a soft/mixed reset, or stop and surface the situation."
fi

# Destructive git: clean -f.
if echo "$COMMAND" | grep -qE '\bgit[[:space:]]+clean[[:space:]]+-[a-zA-Z]*f'; then
  deny "\`git clean -f...\` is blocked — it deletes untracked files irrecoverably. Stop and confirm before removing them."
fi

# Destructive git: force delete branch.
if echo "$COMMAND" | grep -qE '\bgit[[:space:]]+branch[[:space:]]+-D\b'; then
  deny "\`git branch -D\` (force delete) is blocked. Use \`git branch -d\` (safe; fails if unmerged). Force-delete only after confirming."
fi

# Destructive git: force push (any flag form).
if echo "$COMMAND" | grep -qE '\bgit[[:space:]]+push[[:space:]]+([^|;&]*[[:space:]])?(-f\b|--force\b|--force-with-lease\b)'; then
  deny "Force-push is blocked — it rewrites shared history and can destroy the auto-save backup on the remote. If genuinely needed, stop and confirm which commits would be rewritten first."
fi

# Destructive git: remote branch delete.
if echo "$COMMAND" | grep -qE '\bgit[[:space:]]+push[[:space:]].*--delete\b'; then
  deny "\`git push --delete\` is blocked — remote branch deletion is destructive. Stop and confirm first."
fi

# Push to a protected/deploy branch — by current branch OR explicit target.
if echo "$COMMAND" | grep -qE '\bgit[[:space:]]+push\b'; then
  # Explicit target: `... main`, `... dev`, `HEAD:main`, `:dev`, `refs/heads/main`, etc.
  if echo "$COMMAND" | grep -qE '(:|[[:space:]]|/)(main|master|dev)\b'; then
    deny "Pushing to \`main\`/\`master\`/\`dev\` is blocked — these are deploy branches (a push there deploys). Push a feature branch and open a PR; merges to main happen via PR, not a direct push."
  fi
  CURRENT_BRANCH=$(cd "${CLAUDE_PROJECT_DIR:-$(pwd)}" && git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")
  case "$CURRENT_BRANCH" in
    main|master|dev)
      deny "\`git push\` from \`$CURRENT_BRANCH\` is blocked — it's a protected/deploy branch. Create a feature branch first: \`git switch -c feature/<name>\`, then \`git push -u origin HEAD\`." ;;
  esac
fi

# gh auth lifecycle — never manage credentials autonomously.
if echo "$COMMAND" | grep -qE '\bgh[[:space:]]+auth[[:space:]]+(login|refresh|token|setup-git)\b'; then
  deny "\`gh auth (login|refresh|token|setup-git)\` is blocked — Claude does not manage GitHub credentials. If gh fails with an auth error, STOP and surface the exact error; credential state is the user's to resolve."
fi

# Raw API calls against api.github.com.
if echo "$COMMAND" | grep -qE '(curl|wget)[[:space:]].*api\.github\.com'; then
  deny "Raw HTTP against api.github.com is blocked — use \`gh\` or \`gh api <path>\` (same auth, recognized as legitimate dev activity)."
fi

# Everything else passes through silently.
exit 0
