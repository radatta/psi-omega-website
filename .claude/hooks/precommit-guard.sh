#!/bin/bash
  # PreToolUse hook on Bash — gates `git commit`:
  #   1. Blocks a commit on a protected/deploy branch (main/master/dev) — branch first.
  #   2. Hard-blocks if the staged diff contains obvious credential patterns.
  #   3. Else soft-reminds to run code-reviewer + a validation pass. WIP commits exempt.
  # set -euo pipefail; only acts on `git commit`, passes through otherwise.

  set -euo pipefail
  INPUT=$(cat)
  COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // ""')
  [[ "$COMMAND" != *"git commit"* ]] && exit 0

  COMMIT_BRANCH=$(cd "${CLAUDE_PROJECT_DIR:-$(pwd)}" && git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")
  case "$COMMIT_BRANCH" in
    main|master|dev)
      jq -n --arg branch "$COMMIT_BRANCH" '{
        "hookSpecificOutput": {"hookEventName":"PreToolUse","permissionDecision":"deny",
          "permissionDecisionReason": ("Commit on `" + $branch + "` is blocked — create a feature branch first: `git switch -c feature/<name>`, then commit there. A commit on a deploy
  branch cannot be pushed and risks a deploy.")}}'
      exit 0 ;;
  esac

  DIFF=$(cd "${CLAUDE_PROJECT_DIR:-$(pwd)}" && git diff --cached 2>/dev/null || echo "")
  SECRET_PATTERNS='(sk-[a-zA-Z0-9]{20,}|sk-ant-[a-zA-Z0-9_-]{20,}|AKIA[0-9A-Z]{16}|aws_secret_access_key[[:space:]]*=[[:space:]]*["'\'']?[A-Za-z0-9/+=]{20,}|BEGIN[[:space:]]+(RSA[[:space:]
  ]+)?PRIVATE[[:space:]]+KEY|ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{82})'
  if echo "$DIFF" | grep -qE "$SECRET_PATTERNS"; then
    jq -n '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny",
      "permissionDecisionReason":"Staged diff appears to contain a credential or private key. Secrets belong in env / Secrets Manager, not the repo. Unstage the file (git restore --staged
  <file>), remove the credential, and try again."}}'
    exit 0
  fi

  if echo "$COMMAND" | grep -q 'WIP'; then exit 0; fi

  CONTEXT="Before committing: if you have not run the code-reviewer agent on this diff, run it now, and confirm a validation pass ran (bun check-types + bun lint — the same checks the husky pre-commit hook runs). After addressing findings, proceed."
  jq -n --arg ctx "$CONTEXT" '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow","additionalContext":$ctx}}'