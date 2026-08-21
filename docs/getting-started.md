# Getting started

How to get the site running on your own machine. Follow this once; after that
`bun dev` is the only command you need day to day.

## What you need first

**Bun.** This project uses Bun as its package manager and script runner — not
npm, not yarn, not pnpm. Install it:

```bash
curl -fsSL https://bun.sh/install | bash
```

Then close and reopen your terminal, and check it worked:

```bash
bun --version
```

Anything 1.0 or newer is fine. Bun bundles its own Node runtime, so you do not
need to install Node separately.

**Git**, to clone the repo and save your changes. macOS gets it with
`xcode-select --install`.

**ImageMagick**, only if you'll be resizing brother photos —
`brew install imagemagick`. Skip it for now if you're just getting the site
running.

## Set it up

```bash
git clone https://github.com/radatta/psi-omega-website.git
cd psi-omega-website
bun install
```

`bun install` reads `bun.lock` and downloads everything into `node_modules/`. It
takes a minute the first time. You'll also see it set up a git hook — that's
expected, and explained at the bottom of this page.

> **Use `bun install`, never `npm install`.** Mixing package managers creates a
> second lockfile that disagrees with `bun.lock`, and then two people's machines
> quietly run different versions of the same library.

## Run it

```bash
bun dev
```

Open **<http://localhost:5174>**.

**Note the port: 5174, not the 3000 that most Next.js guides mention.** It's set
in `package.json` so the site doesn't collide with other projects.

Leave this running while you work. Every time you save a file, the browser
refreshes itself.

To stop it, press `Ctrl+C` in that terminal.

At this point the whole site works except the alumni database page, which needs
credentials.

## Environment variables

Only one feature needs configuration: the `/database` page, which reads the
alumni spreadsheet from Google Sheets. Everything else is plain files in the
repo and works with no setup.

Create a file called `.env` in the project root:

```bash
GOOGLE_SHEET_ID=the-long-id-from-the-spreadsheet-url
GOOGLE_APPLICATION_CREDENTIALS={"type":"service_account","project_id":"..."}
```

### The trap in `GOOGLE_APPLICATION_CREDENTIALS`

Everywhere else in the Google ecosystem, `GOOGLE_APPLICATION_CREDENTIALS` holds
a **path to a JSON file**. Here it holds **the entire JSON file's contents**, as
one long single-line string.

This is the single most common setup mistake on this project. If you set it to
`./google-service-account.json`, the database page fails with a JSON parse error
that does not explain itself.

To turn the downloaded key file into the right value:

```bash
jq -c . google-service-account.json
```

Copy that entire one-line output as the value. Don't wrap it in quotes.

Where to get the key file, and how to grant it access to the spreadsheet, is in
[database.md](database.md).

### Rules about `.env`

- **`.env` is gitignored and must stay that way.** This repository is public on
  GitHub. Anything committed here is visible to the world, permanently — Git
  history keeps it even after a later deletion.
- Same for `google-service-account.json`, which is also gitignored.
- Never paste credentials into a commit message, an issue, or a Slack message.
- Restart `bun dev` after editing `.env`. Environment variables are read at
  startup and changes are not picked up live.

## The commands

| Command           | What it does                                               |
| ----------------- | ---------------------------------------------------------- |
| `bun dev`         | Development server on <http://localhost:5174>              |
| `bun check-types` | Checks for TypeScript errors. Changes nothing.             |
| `bun lint`        | Checks code style and formatting. Changes nothing.         |
| `bun format`      | Fixes formatting automatically.                            |
| `bun build`       | Builds the production version. Catches errors `dev` won't. |
| `bun start`       | Serves the built version, also on 5174.                    |
| `bun install`     | Installs or updates dependencies.                          |

Note these are run bare — `bun lint`, not `bun run lint`.

## The pre-commit hook

The first time you commit, something will happen that surprises you: the commit
pauses, runs some checks, and **may refuse to complete**.

That's [Husky](https://typicode.github.io/husky/), configured in
`.husky/pre-commit`. Before every commit it runs:

```bash
bun check-types
bun lint
```

If either fails, the commit is cancelled and nothing is saved. This is
deliberate — it stops a broken build from reaching the live site.

**What to do when it blocks you:**

1. Read the error. It names a file and a line number.
2. If it's about formatting — spacing, quote marks, line length — you don't need
   to fix it by hand. Run `bun format`, then `git add` the changed files and
   commit again.
3. If it's a TypeScript error, it's usually a typo: a missing comma between
   roster entries, an unclosed quote, a `year: 2029` that should be
   `year: '2029'`.
4. Run `bun check-types` yourself to re-check without attempting a commit.

Save yourself the surprise by running both commands before you commit.

## When something's wrong

**`bun: command not found`** — Bun isn't on your PATH. Reopen your terminal; if
that doesn't fix it, re-run the install script above.

**Port 5174 already in use** — an old `bun dev` is still running. Find and stop
it:

```bash
lsof -ti:5174 | xargs kill
```

**Page loads but images are missing** — that's the filename contract, not a
setup problem. See [content-updates.md](content-updates.md).

**Database page says it can't load** — check `.env` exists, check
`GOOGLE_APPLICATION_CREDENTIALS` is the JSON contents and not a file path, and
restart `bun dev`. See [database.md](database.md).

**Something broke after pulling changes** — someone added a dependency. Run
`bun install` again.

**Truly stuck** — delete `node_modules/` and reinstall it from scratch:

```bash
rm -r node_modules
bun install
```
