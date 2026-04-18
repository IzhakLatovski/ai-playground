---
description: Stage all changes, commit with a relevant message, and push to the remote
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git commit:*), Bash(git push:*), Bash(git rev-parse:*), Bash(git branch:*)
---

Perform a full git commit-and-push cycle:

1. Run `git status` and `git diff` (staged + unstaged) in parallel to see what's changed. Also run `git log -5 --oneline` to match the repo's commit message style.
2. Review the changes and draft a conventional commit message (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`) that summarizes the *why* of the changes in 1–2 sentences.
3. Stage the relevant files by name with `git add <file>...` (do NOT use `git add -A` or `git add .` — skip anything that looks like a secret, .env file, or gitignored content; warn the user if any such file is present).
4. Commit with a HEREDOC:
   ```
   git commit -m "$(cat <<'EOF'
   <your message>

   Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
   EOF
   )"
   ```
5. Push with `git push`. If the branch has no upstream, use `git push -u origin <current-branch>`.
6. Report the result: the commit hash, message, and push outcome.

Guardrails:
- If there are no changes to commit, say so and stop — do not create an empty commit.
- If a pre-commit hook fails, fix the issue, re-stage, and create a NEW commit (never `--amend`, never `--no-verify`).
- Never force-push. Never push to `main`/`master` with `--force`.
- If no remote is configured, stop and tell the user.
