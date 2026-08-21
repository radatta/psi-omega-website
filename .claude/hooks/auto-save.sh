  #!/bin/bash
  # Stop hook — auto-saves uncommitted work so a lost/closed session can't wipe it.
  # Feature branch only (never a protected/deploy branch), last commit >10 min old,
  # no merge/rebase in progress, no credential staged. Commits + pushes a WIP save.
  # set -u only; fail-open everywhere.

  set -u
  REPO="${CLAUDE_PROJECT_DIR:-$(pwd)}"
  cd "$REPO" 2>/dev/null || exit 0
  command -v git >/dev/null 2>&1 || exit 0
  g() { git "$@" 2>/dev/null; }
  g rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

  BRANCH=$(g rev-parse --abbrev-ref HEAD || echo "")
  case "$BRANCH" in main|master|dev|HEAD|"") exit 0 ;; esac
  [ -z "$(g status --porcelain || echo "")" ] && exit 0

  LAST=$(g log -1 --format=%ct || echo 0)
  case "$LAST" in ''|*[!0-9]*) LAST=0 ;; esac
  [ "$LAST" -gt 0 ] || exit 0
  NOW=$(date +%s)
  [ $(( (NOW - LAST) / 60 )) -ge 10 ] || exit 0

  GITDIR=$(g rev-parse --git-dir || echo ".git")
  if [ -f "$GITDIR/MERGE_HEAD" ] || [ -d "$GITDIR/rebase-merge" ] || [ -d "$GITDIR/rebase-apply" ]; then exit 0; fi

  g add -A
  SECRET_PATTERNS='(sk-[a-zA-Z0-9]{20,}|sk-ant-[a-zA-Z0-9_-]{20,}|AKIA[0-9A-Z]{16}|aws_secret_access_key[[:space:]]*=[[:space:]]*["'\'']?[A-Za-z0-9/+=]{20,}|BEGIN[[:space:]]+(RSA[[:space:]
  ]+)?PRIVATE[[:space:]]+KEY|ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{82})'
  if g diff --cached | grep -qE "$SECRET_PATTERNS"; then
    g reset -q
    jq -n '{"systemMessage":"Auto-save SKIPPED: a possible credential is in the working tree. Remove it, then commit manually — your work is NOT backed up yet."}'
    exit 0
  fi

  if ! g commit -m "WIP: auto-save (Stop hook)" >/dev/null 2>&1; then g reset -q; exit 0; fi

  if g rev-parse --abbrev-ref '@{u}' >/dev/null 2>&1; then
    g push >/dev/null 2>&1 && PUSHED=1 || PUSHED=0
  else
    g push -u origin "$BRANCH" >/dev/null 2>&1 && PUSHED=1 || PUSHED=0
  fi

  if [ "${PUSHED:-0}" = "1" ]; then
    jq -n --arg b "$BRANCH" '{"systemMessage":("Auto-saved uncommitted work — WIP commit pushed to \($b). Recoverable if this session is lost.")}'
  else
    jq -n '{"systemMessage":"Auto-saved locally (WIP commit) but push failed — work is safe locally; git push when able."}'
  fi
  exit 0