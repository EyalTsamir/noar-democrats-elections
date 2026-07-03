# /push — Review staged files, sanity-check, and push

You are performing a push workflow for the NoarDemocratsElections project. Follow these steps carefully and in order.

There is no UI version badge or version display anywhere in this project (it's a static election site, not an app with a beta badge) — do NOT invent a version-bump step. `package.json`'s `version` field is an unused placeholder; leave it alone.

## Step 1: Stage ALL modified files

1. Run `git status` to see all modified, staged, and untracked files.
2. Stage **all** modified and previously-staged files — not just files changed in the current conversation. The push captures the full state of the working tree.
3. **Exclude** (unstage with `git reset HEAD <file>`) only files that are clearly: temporary files, debug artifacts (e.g. ad-hoc screenshots dropped at the repo root), generated/build output (`dist/`), log files, `.env` or credential files, or other unintended changes.
4. **If uncertain** about any file — ask the user before proceeding. Do not silently exclude or include ambiguous files.
5. Run `git diff --cached --stat` for an overview of what will be committed.

## Step 2: Local sanity check

Lint and test failures block the GitHub Actions deploy (`.github/workflows/deploy.yml` runs lint → test → build → publish on every push to `main`). Before proposing a commit:

1. Run `npm run lint`.
2. Run `npm test`.
3. If either fails, fix the issue (or ask the user how to proceed) before continuing — don't hand the user a commit that will fail CI.

## Step 3: Generate commit message and commit

1. Review all staged changes (read the diffs, not just file names) and identify distinct **change topics** — logical themes that group related changes regardless of which files they touch.
2. Compose a commit message matching this repo's existing style (see `git log`):
   ```
   <Short imperative summary line, no period>

   - <change topic, one line>
   - <change topic, one line>
   ...
   ```
   - Title line: concise, imperative mood (e.g. "Add candidate photo cropping", "Fix countdown drift on tab wake"), under ~70 characters.
   - Body: a flat bullet list (`-`), one line per logical change, feature-level not file-level. Wrap long bullets onto continuation lines indented to match, as in prior commits.
   - Write in **English**, matching the existing commit history — even though code comments and content files are Hebrew, commit messages in this repo are English.
   - If a change is purely internal (refactor, test-only, formatting) with no user-visible effect, say so plainly rather than overstating it.
   - Skip the body entirely for genuinely small, single-purpose commits — not every commit needs bullets.
3. Present the commit message to the user for approval before committing.
4. Once approved, commit with a `Co-Authored-By: Claude <model> <noreply@anthropic.com>` trailer (matching prior commits), then push to the remote.

## Important notes

- Pushing to `main` triggers an automatic production deploy via GitHub Pages — treat it accordingly, and don't push if Step 2 surfaced unresolved failures.
- Always ask the user before proceeding if anything is unclear or ambiguous.
- Use Hebrew for user-facing chat messages if the user is communicating in Hebrew. The commit message itself stays in English (Step 3).
