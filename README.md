# Psi Omega Chapter Website

The public site for the **Psi Omega chapter of Alpha Kappa Psi** at Santa Clara
University.

Its main job is recruitment: a prospective member should be able to find rush
dates, the application, and a face for the chapter in under a minute. Its
secondary job is the alumni database — a table of alumni employers and contacts
for brothers looking for connections.

Live at the chapter's domain, deployed automatically from `main`.

## Quick start

```bash
bun install
bun dev
```

Then open **<http://localhost:5174>** (not 3000).

Full setup, including the `.env` needed for the database page, is in
[docs/getting-started.md](docs/getting-started.md).

## Documentation

**Start at [docs/index.md](docs/index.md).**

| Doc                                           | For                                              |
| --------------------------------------------- | ------------------------------------------------ |
| [getting-started.md](docs/getting-started.md) | Installing and running it the first time         |
| [content-updates.md](docs/content-updates.md) | **The one you'll use most** — every routine edit |
| [architecture.md](docs/architecture.md)       | How the code is organised                        |
| [database.md](docs/database.md)               | The alumni Google Sheet integration              |
| [deployment.md](docs/deployment.md)           | Branches, previews, Vercel                       |

## What's here

Eight pages — home, about, brothers, rush, events, memories, legacy, database.

Site content is **plain TypeScript in `lib/*_data.ts`**, edited by hand each
term. There is no CMS. Adding a pledge class means editing an array and adding
photos; updating rush means editing seven fields in one file.

The only dynamic feature is `/database`, which reads a Google Sheet through a
service account.

```
app/          Route segments — one directory per page, plus the two API routes
components/   Feature folders (about, brothers, database, home, rush) + ui/ primitives
lib/          Site content as TypeScript data files
public/       Images, one subdirectory per surface, and fonts
docs/         Everything above
```

## Tech stack

- **Next.js 15** (App Router) and **React 19**
- **TypeScript**
- **Tailwind CSS v4** — note the major version; config lives in
  `app/globals.css`, not `tailwind.config.ts`
- **shadcn/ui** on Radix primitives
- **motion** (`motion/react`) for animation
- **TanStack Table** for the alumni table
- **googleapis** for the Sheets read
- **Bun** as package manager and script runner
- **Vercel** for hosting

## Commands

| Command           | Does                       |
| ----------------- | -------------------------- |
| `bun dev`         | Dev server on port 5174    |
| `bun check-types` | TypeScript check           |
| `bun lint`        | ESLint + Prettier          |
| `bun format`      | Fix formatting             |
| `bun test`        | Data-integrity tests       |
| `bun run build`   | Production build           |
| `bun start`       | Serve the production build |

`bun check-types`, `bun lint`, and `bun test` also run automatically before
every commit. Note `bun run build`, not bare `bun build` — `build` is a bun
builtin and would run bun's bundler instead of Next's.

## Contributing

Branch, commit, open a PR, check the Vercel preview, squash-merge. Never commit
directly to `main` — that's a production deploy. Details in
[docs/deployment.md](docs/deployment.md).

**This repository is public.** No credentials in source, ever, and be
deliberate about what personal information goes on a public page.

## Known gaps

Documented honestly so nobody rediscovers them the hard way:

- **`/database` is not actually protected.** The password check is client-side
  and the API route behind it is unauthenticated, so the alumni sheet is
  effectively public. See [docs/database.md](docs/database.md). Fix in progress.
- **Data-integrity tests only, and no CI.** `bun test` checks that every
  referenced image exists, but there are no unit, component, or end-to-end
  tests, and nothing runs on a PR. Verification is `bun check-types`,
  `bun lint`, `bun test`, and looking at the page.
- **No server components.** Every page is `'use client'`, so no page can export
  `metadata` and nothing is server-rendered.
- **Dark mode is wired but unreachable** — the provider is pinned to light and
  no toggle exists.
- Some dead code and stale config remain; they're listed at the end of
  [docs/architecture.md](docs/architecture.md).
