# Architecture

What's where and why. Read this when you need to change something that isn't
covered by a runbook in [content-updates.md](content-updates.md).

## The shape of it

A Next.js 15 site using the App Router, deployed on Vercel. Eight pages, almost
entirely static content stored as TypeScript files. One dynamic feature — the
alumni database — which reads a Google Sheet.

```
lib/*_data.ts  ──>  app/*/page.tsx  ──>  components/
   (content)          (routes)            (rendering)

                 app/database/api/sheet  ──>  Google Sheets
                     (the one live call)
```

There is no CMS, no database, and no build step beyond Next's own. Changing site
content means editing a `.ts` file and committing it.

## Routes

One directory per page under `app/`, each containing a `page.tsx`.

| URL                  | File                             | What's on it                       |
| -------------------- | -------------------------------- | ---------------------------------- |
| `/`                  | `app/page.tsx`                   | Hero, president's letter, sponsors |
| `/about-akpsi`       | `app/about-akpsi/page.tsx`       | Values, history, statistics        |
| `/meet-the-brothers` | `app/meet-the-brothers/page.tsx` | Exec, chairs, 6 pledge classes     |
| `/rush-akpsi`        | `app/rush-akpsi/page.tsx`        | Rush dates, flyer, application     |
| `/events`            | `app/events/page.tsx`            | Three photo galleries              |
| `/memories`          | `app/memories/page.tsx`          | Shuffled photo wall                |
| `/legacy`            | `app/legacy/page.tsx`            | Alumni employer logos              |
| `/database`          | `app/database/page.tsx`          | Alumni table (see database.md)     |

Plus two API routes under `app/database/api/`, covered in
[database.md](database.md).

`app/layout.tsx` wraps every page with the navbar, footer, and fonts. Alongside
it are the App Router's special files: `not-found.tsx` (404), `error.tsx` (the
per-page error boundary — it must be a client component), `global-error.tsx`
(which catches throws from the root layout itself, since `error.tsx` renders
inside it), and `sitemap.ts` / `robots.ts`, which Next serves as `/sitemap.xml`
and `/robots.txt`. Both of those exclude `/database`, and both need an absolute
origin, which comes from `lib/utils/site-url.ts`.

There is no `loading.tsx`. Every page is statically prerendered, so there is no
loading state to show — adding one would only introduce a flash.

## Every page is a client component

**All eight pages start with `'use client'`.** The server components are
`app/layout.tsx` — which is why it is the only file that can export `metadata` —
plus `app/not-found.tsx`, `app/sitemap.ts` and `app/robots.ts`. None of them is
a `page.tsx`, though `not-found.tsx` does render for any unmatched URL.

This matters more than it sounds:

- Animations and React hooks work in any file, with no "you can't use this in a
  server component" errors. That's why it ended up this way.
- Nothing benefits from server rendering. Pages ship to the browser and render
  there.
- **A page cannot export `metadata`.** Next.js forbids it in client components.
  This is why `app/about-akpsi/page.tsx` has its `metadata` block commented out,
  and why only the root layout sets any page titles.
- Don't assume a file without a directive is a server component. Check the file.

Changing this would mean splitting each page into a server shell and a client
body. Worth doing eventually for SEO; not a small change.

## Where content lives

| Content                            | File                            |
| ---------------------------------- | ------------------------------- |
| Exec, chairs, pledge-class rosters | `lib/brothers_data.ts`          |
| Rush dates, flyer, application     | `lib/rush_data.ts`              |
| Alumni employer logos              | `lib/legacy_data.ts`            |
| Memories photo wall                | `lib/memories_data.ts`          |
| Event galleries                    | inline in `app/events/page.tsx` |
| President's letter, sponsors       | inline in `app/page.tsx`        |

The last two are inconsistent — they should be in `lib/` like everything else,
but they aren't. If you're already editing them, moving them is a reasonable
cleanup.

Runbooks for all of these are in [content-updates.md](content-updates.md).

### Data shapes

```ts
// lib/brothers_data.ts
executiveCommittee: { name, position }[]     // rendered with photos
committeeChairs:    { name, position }[]     // text only, no photos
alphaOmicron … alphaUpsilon: { name, major, year }[] // rendered with photos

// lib/rush_data.ts
currentRushData: {
    rushName, rushDate, rushWeek, rushFlyer, rushMailingList,
    rushApplication: { link, dueDate }
}

// lib/legacy_data.ts
companies: { name, logo }[]        // logo is a bare filename, not a path

// lib/memories_data.ts
memoriesPhotosPaths: { src, alt }[]  // src is a full path from /
```

Note the inconsistency between `legacy_data` (bare filename, page prepends the
directory) and `memories_data` (full path). Match whichever file you're editing.

## Components

```
components/
    about/       values, history, statistics sections
    brothers/    BrotherCard
    database/    Database, columns, data-table
    home/        typewriter-effect
    rush/        rush-faq
    ui/          shadcn primitives (button, table, select, dropdown-menu, …)
    navbar.tsx
    footer.tsx
    theme-provider.tsx
```

Feature folders hold components used by one page; `ui/` holds generic
primitives generated by shadcn.

`hooks/use-mobile.tsx` is the only custom hook.

### `BrotherCard` and the filename contract

`lib/utils/brother-photo.ts` derives the image path from the `name`, and
`components/brothers/BrotherCard.tsx` renders whatever it returns:

```ts
export const brotherPhotoPath = (name: string) =>
    `/images/brothers/${name.split(' ').join('-')}.jpg`;
```

It lives in its own file because the data-integrity tests have to apply the
exact same rule — if the two ever disagreed, the tests would pass while the
page rendered blank boxes.

A brother named `Jane Doe` requires exactly
`public/images/brothers/Jane-Doe.jpg`. There is no fallback and no error — a
mismatch renders a blank box.

This is the most important contract in the codebase because it's the one that
gets broken every term. See [content-updates.md](content-updates.md).

The card ignores the `year` field that every pledge-class entry has. Harmless —
pages spread `{...member}` and the card takes only what it renders.

## Images

All under `public/images/`, one directory per surface:

| Directory    | Contents                 | Naming                         |
| ------------ | ------------------------ | ------------------------------ |
| `brothers/`  | Headshots                | `First-Last.jpg`, **exact**    |
| `companies/` | Employer + sponsor logos | No convention; matched by data |
| `events/`    | Gallery photos           | `Category-N.jpg`               |
| `memories/`  | Photo wall               | `memory_N.jpg`, non-contiguous |
| `rush/`      | Flyer                    | `rush-flyer.png`               |
| `values/`    | Values section art       | —                              |

Page-level hero images sit loose in `public/images/` rather than in a
subdirectory.

Images are rendered through `next/image`, which handles resizing and modern
formats automatically. `next.config.ts` configures it to serve AVIF and WebP.
Always use `next/image` with real `alt` text rather than a bare `<img>`.

Source images still need manual downscaling before they're committed — see the
photo pipeline in [content-updates.md](content-updates.md).

## Styling

**Tailwind CSS v4.** This is a breaking-change boundary: most Tailwind guides
and Stack Overflow answers online describe v3, and the configuration model is
completely different.

**Design tokens live in `app/globals.css`**, in an `@theme` block:

```css
@theme {
    --color-akpsi-yellow: hsl(44 50% 52%);
    --color-akpsi-blue: hsl(220 60% 22%);
}
```

Plus light and dark HSL variable sets further down the same file. That's the
whole theme — chapter colours, and the shadcn palette.

> **There is no `tailwind.config.ts`, and there shouldn't be.** Tailwind v4
> only reads one when a `@config` directive points at it, and nothing here
> does. A v3-style config file used to sit in the repo root doing nothing at
> all; it was deleted. Change `app/globals.css` instead.

### Fonts

Cera Pro (chapter font) and Rubik, both loaded via `next/font/local` in
`app/layout.tsx` from `public/fonts/`. All 12 Cera Pro weights and italics are
wired up and exposed as the CSS variables `--font-cera-pro` and `--font-rubik`.

### Dark mode

`next-themes` is installed and `components/theme-provider.tsx` exists, but it's
hardcoded to `defaultTheme='light'`, system detection is commented out, and
nothing anywhere calls `setTheme`. **There is no working dark mode and no
toggle.** The dark CSS variables are defined but unreachable.

## Animation

`motion` (the successor to Framer Motion), imported as **`motion/react`**:

```ts
import { motion } from 'motion/react';
```

The common pattern is a fade-and-rise on scroll:

```tsx
<motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    viewport={{ once: true, margin: '200px' }}
>
```

`viewport={{ once: true }}` stops it replaying on every scroll past. The
`delay: index * 0.1` staggers items in a grid.

> **Some older files import `framer-motion` instead.** That package is **not in
> `package.json`** — it resolves only because it's a dependency of `motion`. It
> works today and could stop working after any dependency update. Convert those
> imports to `motion/react` when you touch the file.

## Utilities

Four small modules live in `lib/utils/`:

| Module             | What it does                                                       |
| ------------------ | ------------------------------------------------------------------ |
| `brother-photo.ts` | Maps a roster name to its photo path — the filename contract above |
| `cn.ts`            | Merges Tailwind class names                                        |
| `roster.ts`        | Derives member and major counts from the pledge-class rosters      |
| `site-url.ts`      | Resolves the absolute site origin for `sitemap.ts` / `robots.ts`   |

Server-only code lives in `lib/server/` instead — currently the `/database`
session signing and login rate limiter. Keeping it out of `lib/utils/` means a
stray import can't drag `node:crypto` into a client bundle.

`cn()` merges Tailwind class names. It lives at **`lib/utils/cn.ts`**:

```ts
import { cn } from '@/lib/utils/cn';
```

> `components.json` points shadcn's `utils` alias at `@/lib/utils/cn`, so
> `shadcn add` now generates the right import. It used to point at the default
> `@/lib/utils`, which produced imports that didn't resolve.

## Path aliases

`@/` maps to the project root — `@/lib/rush_data`, `@/components/navbar`. It's
the only alias in real use.

It is also the only alias declared. `tsconfig.json` used to carry five more
(`@components/*`, `@hooks/*`, `@lib/*`, `@utils/*`, `@ui/*`) that nothing
imported — one of them pointing at a `lib/ui/` directory that has never
existed. They were removed. Use `@/`.

## Tooling

- **Bun** for installs and scripts. `bun.lock` is the committed lockfile.
- **`bunfig.toml` pins the test root to `tests/`.** `bun test` is a bun
  builtin, so it ignores the `package.json` `test` script and would
  otherwise walk the whole tree — including gitignored scratch in
  `localNotes/`, whose unrelated suites fail and take the pre-commit hook
  down with them. `tsconfig.json` excludes the same directories for the
  same reason.
- **ESLint + Prettier**, with Prettier violations reported as lint _errors_ —
  formatting is enforced, not suggested. 4-space indent, single quotes,
  semicolons, 80 columns. Run `bun format` rather than fixing by hand.
- **Husky** runs `bun check-types`, `bun lint`, and `bun test` before every
  commit.
- **Tests** run on bun's built-in runner — no test framework in `package.json`.
  Nine files:

    | File                       | Covers                                           |
    | -------------------------- | ------------------------------------------------ |
    | `data-integrity.test.ts`   | Every `/images/...` path resolves, no orphans    |
    | `roster.test.ts`           | Derived member counts vs photos on disk          |
    | `site-routes.test.ts`      | The sitemap covers every page                    |
    | `site-url.test.ts`         | The origin is always a parseable URL             |
    | `session.test.ts`          | Session token signing and verification           |
    | `rate-limit.test.ts`       | Login throttling                                 |
    | `database-routes.test.ts`  | The `/database` gate, via the real handlers      |
    | `database-sheet.test.ts`   | Sheet grid → rows, and header → column decisions |
    | `database-columns.test.ts` | Column sizes, sorting flags and cell renderers   |

    There are **no component tests** — for anything visual, still look at the page.

## Known rough edges

Things that are true today and will confuse you if you don't know them:

- Every page is `'use client'`; no page can export `metadata`.
- Dark mode is wired but unreachable.
- `eslint-config-next` is pinned a patch behind `next` (15.2.4 vs 15.2.8).
- ESLint still uses the legacy `.eslintrc.json` format under Next 15, which
  defaults to flat config. It works; migrating needs ESLint 9.
