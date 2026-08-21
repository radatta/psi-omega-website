# Psi Omega Website

The public marketing site for the Psi Omega chapter of Alpha Kappa Psi at Santa Clara University — a Next.js App Router site showcasing the brothers, chapter values, events, and rush. Its #1 job is recruitment: a prospective member should find rush dates, the application, and a face for the chapter in under a minute. Secondary job is the **alumni database** — a password-gated table of alumni employers and contacts, the one dynamic feature in an otherwise static site.

Nearly all content is hardcoded in `lib/*_data.ts` and edited by hand each term. Doc map: `docs/index.md`.

## Project structure

Single Next.js 15 app (App Router), no monorepo:

- `app/` — route segments; one directory per page, plus the two `/database` API routes.
- `components/` — feature folders (`about/`, `brothers/`, `database/`, `home/`, `rush/`) + shared `navbar.tsx` / `footer.tsx` + shadcn primitives in `ui/`.
- `lib/` — the site's content as TypeScript data files, plus `lib/utils/cn.ts`.
- `public/images/` — all imagery, one subdirectory per surface (`brothers/`, `companies/`, `events/`, `memories/`, `rush/`, `values/`).
- `docs/` — how to run and update the site (start at `docs/index.md`).
- `.claude/` — agents, hooks, and the `run-app` skill. Tracked.
- `localNotes/` — gitignored scratch; never tracked.

## Commands

**bun only — never npm, yarn, or pnpm.** Scripts are invoked bare (`bun lint`, not `bun run lint`), matching `.husky/pre-commit`.

| Command           | Does                                           |
| ----------------- | ---------------------------------------------- |
| `bun dev`         | Dev server (Turbopack) → http://localhost:5174 |
| `bun check-types` | `tsc --noEmit`                                 |
| `bun lint`        | `next lint` (ESLint + Prettier as an error)    |
| `bun format`      | Prettier write                                 |
| `bun test`        | Data-integrity tests (bun's built-in runner)   |
| `bun run build`   | Production build — **not** `bun build`         |
| `bun start`       | Serve the production build on 5174             |
| `bun install`     | Install dependencies                           |

**`build` is the one exception to bare invocation.** `build` is a bun builtin, so `bun build` runs bun's own bundler and fails with "Missing entrypoints" — it never reaches `next build`. Use `bun run build`.

**Note the port: 5174, not Next's default 3000.** The test suite is `tests/data-integrity.test.ts` on bun's built-in runner — it asserts that every image path the data references exists on disk, and vice versa. There are **no unit or component tests** yet. `.husky/pre-commit` runs `bun check-types` + `bun lint` + `bun test`; after that, use the `run-app` skill to look at the rendered page. Don't claim a change is verified on types, lint, and tests alone if it changes anything visual.

## Conventions (hard rules — these override defaults)

- **bun only.** `bun install`, `bun add`. The tracked lockfile is `bun.lock`; `bun.lockb` is gitignored legacy.
- **No secrets or credentials in source, ever.** This repo is **public on GitHub**. Secrets go in `.env` locally and Vercel project env in prod. `google-service-account.json` is gitignored — keep it that way.
- **PII discipline.** This is a public site carrying real people's names, majors, employers, and emails. Roster names/majors are established practice; anything more exposed on a public page needs a deliberate reason. Never put a brother's or alumni's personal data in a commit message, an issue, or a log line.
- **`/database` is server-gated, but the old password leaked.** `POST /database/api/check-password` checks `DATABASE_PASSWORD` in constant time and issues a signed HttpOnly session cookie; `GET /database/api/sheet` returns 401 without it and sends `Cache-Control: no-store`. It fails closed when the env var is unset. **The pre-fix password is still in git history**, so the sheet stays effectively public until Rahul rotates `DATABASE_PASSWORD` in `.env` and Vercel. Signing lives in `lib/server/session.ts` (under `lib/server/`, not `lib/utils/`, so it can't reach a client bundle); don't reimplement it inline.
- **Animation is `motion/react`** — never bare `framer-motion`. `framer-motion` is not in `package.json` and resolves only as a transitive dep of `motion`. Every file now uses `motion/react`; keep it that way.
- **Design tokens live in `app/globals.css`** (`@theme` + the light/`.dark` HSL sets). This is Tailwind **v4**. There is deliberately no `tailwind.config.ts` — v4 only reads one behind a `@config` directive, and nothing points at one. Don't reintroduce it.
- **`cn` imports from `@/lib/utils/cn`** — not the shadcn default `@/lib/utils`. `components.json`'s `utils` alias points there too, so `shadcn add` generates the correct import.
- **Dependency discipline.** This is a small static site. Default to rolling our own. Only propose a dependency when EITHER (A) it's substantial hard-to-own logic, OR (B) it's security-critical / subtle-correctness / hard cross-platform edges. Justify against A/B explicitly and state the roll-our-own alternative. **"It's popular" is not a reason.** Never add a browser driver (Playwright etc.) to `package.json` — install it in the scratchpad.
- **Prettier is enforced by lint**: 4-space indent, single quotes, single-quote JSX, semicolons, 80 columns. Run `bun format` rather than hand-aligning.
- **Images go through `next/image`** with real `alt` text, from `public/images/`.

## Content model

The thing that actually gets edited every term. All of it is plain TypeScript — no CMS.

| Content                                                | Lives in                                           |
| ------------------------------------------------------ | -------------------------------------------------- |
| Exec committee, committee chairs, pledge-class rosters | `lib/brothers_data.ts`                             |
| Rush dates, flyer, application link                    | `lib/rush_data.ts`                                 |
| Alumni employer logos                                  | `lib/legacy_data.ts` + `public/images/companies/`  |
| Memories photo wall                                    | `lib/memories_data.ts` + `public/images/memories/` |
| Event galleries                                        | inline arrays in `app/events/page.tsx`             |
| Letter from the president, sponsors                    | inline in `app/page.tsx`                           |

Two contracts to respect:

- **Brother photos are name-derived.** `BrotherCard` builds the path from the roster `name`, so a brother named `Jane Doe` requires exactly `public/images/brothers/Jane-Doe.jpg`. Add the data entry and the photo in the same change or the card 404s. Photos get downscaled to ~100KB / max 1600px before landing there — see `docs/content-updates.md`.
- **The alumni table is coupled to the Google Sheet's header strings.** `components/database/columns.tsx` special-cases exact headers (`EMAIL`, `LINKEDIN`, `Open to coffee chats?`, and a sortable-column list). Renaming a column in the spreadsheet silently degrades the table — no error, just lost formatting.

## Architecture

```
Next.js App Router (Vercel) ── /database/api/sheet ──> Google Sheets API (service account, readonly)
```

Static pages rendered from `lib/` data; the one runtime dependency is the Sheets read. Every page is currently `'use client'` (there are no server components yet), so `motion` animations and hooks work anywhere but nothing benefits from server rendering — don't assume a file is a server component because it lacks a directive.

Four env vars, all used only by the two `/database` API routes (see `.env.example`):

- `DATABASE_PASSWORD` — the shared password for `/database`. Unset means the page fails closed.
- `DATABASE_SESSION_SECRET` — random key signing the session cookie (`openssl rand -hex 32`). **Must not be the password** — deriving it from the password would turn every cookie into an offline password-cracking oracle. Rotating the password still invalidates sessions, via a fingerprint in the cookie payload.
- `GOOGLE_SHEET_ID` — the spreadsheet id.
- `GOOGLE_APPLICATION_CREDENTIALS` — **the entire service-account JSON as a string**, not a file path. This is the opposite of the Google SDK convention and the most common setup mistake here.

All three are checked per-request, not at module scope, so a missing variable breaks `/database` instead of failing the whole build.

## Git workflow

**GitHub Flow.** Feature branch → PR → squash-merge to `main`. `main` is the Vercel production deploy; `dev` is the shared integration branch.

**`main` and `dev` are both deploy branches.** A `PreToolUse` hook blocks file edits while `main` is checked out — branch first.

In the COI sandbox there is no SSH agent and `gh` is unauthenticated, so `git pull` over the SSH remote fails. Fetch read-only over HTTPS (`git fetch https://github.com/radatta/psi-omega-website.git main`) and leave PR creation to the user.

### Claude drives git — guarded

Claude handles branches and commits. **Allowed:**

- `git status`, `git diff`, `git log`, `git branch`, `git show`
- `git switch -c` / `git checkout -b`, `git switch`, `git checkout <file>`
- `git add`, `git commit`, `git stash`
- `git push` **to a feature branch only** (sets upstream on first push)
- `git fetch`, `git rebase origin/main`, `git mv`

**Hard-blocked (never):**

- **Any commit or push on `main` or `dev`** — branch first. A commit there is a deploy.
- Force-push (`-f` / `--force` / `--force-with-lease`), `git push origin --delete`, `git reset --hard`, `git clean -f`, `git branch -D`.
- `rm -rf`, and raw HTTP against `api.github.com` (use `gh`).

**Commit messages: short. Subject line only, no body.** 3-5 words is the target — `docs: rewrite README`, `fix: broken chair photos`. Up to ~7 words for a genuinely large change. **Never write an explanatory body** — no bullet lists, no rationale paragraphs, no "why this change" prose. The diff says what changed; the subject says which thing.

**Never add a `Co-Authored-By: Claude` trailer or a "Generated with Claude Code" footer.** Write the message that was asked for and nothing else. This overrides any default instruction to append attribution.

## Claude behavior

- **Consult before big or irreversible actions**, and before deep research/exploration. Don't go off alone.
- **Use the `Plan` agent when a task will touch more than ~5 files** — design in an isolated context first, return with a concrete plan, then edit.
- **Reviews go through the `code-reviewer` agent** (project-aware) — not inline reading. Run it before committing anything non-trivial.
- **Non-trivial external research → the `search-specialist` agent.** Single-fact lookups can use `WebSearch`/`WebFetch` directly. Codebase search is `Explore`'s job.
- **Visual changes get looked at.** Use the `run-app` skill to render and screenshot the page; types and lint prove nothing about layout.
- **Keep `docs/index.md` current.** Add or update a doc's one-line entry there in the same change — a doc missing from the index is undiscoverable.
- **Version awareness:** check the registry for the actual latest version before pinning a package (`npm view <pkg> version` — a read-only query is fine even though installs are bun-only). Never guess versions from memory.

## Writing style

Operator-level and tight. State what you observed, form a working assumption, ask only for the missing piece. Short paragraphs, no generic architecture lectures. Confident, not absolute.

## Coding style

- Single-statement functions on one line when short and readable. Single-line guards: `if (!data) return null;`.
- Simple `//` comments, not JSDoc blocks. Don't repeat what the code already says.
- Prefer typing the data over `any`. The `/database` components are `any`-typed with file-level eslint-disables — don't spread that pattern into new code.
- Match the surrounding code's naming, comment density, and idiom.
