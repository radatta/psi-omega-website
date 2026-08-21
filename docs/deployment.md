# Deployment

The site is hosted on [Vercel](https://vercel.com), connected to the GitHub
repository. **You do not deploy by hand.** Merging to `main` deploys to
production, automatically, within a couple of minutes.

## Branches

| Branch        | What it is                                          |
| ------------- | --------------------------------------------------- |
| `main`        | **Production.** Merging here updates the live site. |
| `dev`         | Shared integration branch.                          |
| anything else | A feature branch. Gets its own preview URL.         |

**Never commit directly to `main` or `dev`.** A commit to `main` is a deploy,
with no review step in between.

## The workflow

```bash
# 1. Start from an up-to-date main
git switch main
git pull

# 2. Branch
git switch -c docs/fix-rush-dates

# 3. Make your change, then check it
bun check-types
bun lint

# 4. Commit and push
git add lib/rush_data.ts
git commit -m "Update rush dates for Winter 2026"
git push -u origin docs/fix-rush-dates
```

Then open a pull request on GitHub. Vercel comments on it with a **preview URL**
— a complete, working copy of the site with your changes, at its own address.

**Open that preview and look at the pages you changed.** This is the step that
catches missing photos, and it costs thirty seconds.

When it looks right, squash-merge the PR. Production updates on its own.

### Branch naming

Loose convention, no enforcement: `feat/`, `fix/`, `refactor/`, `docs/`,
`chore/`, then a short description.

## Environment variables

The database variables from [getting-started.md](getting-started.md) must
**also** be set in Vercel. Your local `.env` is not deployed — it's gitignored and never
leaves your machine.

In the Vercel dashboard: **Project → Settings → Environment Variables**.

| Variable                         | Value                                       |
| -------------------------------- | ------------------------------------------- |
| `DATABASE_PASSWORD`              | The shared password for `/database`         |
| `DATABASE_SESSION_SECRET`        | Random cookie signing key, not the password |
| `NEXT_PUBLIC_SITE_URL`           | Optional — the site's absolute origin       |
| `GOOGLE_SHEET_ID`                | The spreadsheet id                          |
| `GOOGLE_APPLICATION_CREDENTIALS` | The whole service-account JSON, one line    |

Same trap as locally: `GOOGLE_APPLICATION_CREDENTIALS` is the **contents** of
the JSON key file, not a path.

`NEXT_PUBLIC_SITE_URL` is optional. Vercel sets `VERCEL_PROJECT_PRODUCTION_URL`
itself, and `sitemap.xml` / `robots.txt` fall back to it, so production is
correct without doing anything. Set it explicitly if you want the custom domain
used in preview deployments as well.

Set them for all three environments (Production, Preview, Development), or the
database page will work in production and fail on every PR preview.

**Changing an environment variable does not redeploy the site.** The new value
only takes effect on the next deployment. To apply it immediately, go to the
Deployments tab and redeploy the latest one.

## If a deployment fails

Vercel emails on failure and shows the error in the dashboard under the failed
deployment's **Build Logs**.

The usual causes, in order:

1. **A TypeScript error.** The pre-commit hook catches these, so this mostly
   happens when someone bypassed it with `--no-verify`. Run `bun check-types`
   locally.
2. **A build-only error.** `bun run build` is stricter than `bun dev`. If a
   deployment fails but the site runs fine locally, run `bun run build` locally
   to reproduce it. (It must be `bun run build` — bare `bun build` invokes
   bun's own bundler and never reaches `next build`.)
3. **A missing environment variable.** This no longer fails the build — the
   database route checks its variables per-request and returns 503 — but
   `/database` will be broken in the deployed site.

A failed deployment does **not** take the live site down. Vercel keeps serving
the last successful build.

### Rolling back

Vercel dashboard → **Deployments** → find the last good one → **⋯** →
**Promote to Production**. Takes seconds. Do this first if something is broken
on the live site, then work out the fix.

## Things this doc can't tell you

These are account-specific and need to come from whoever currently administers
the site:

- **Who has access to the Vercel account**, and how to get added.
- **Which Vercel account or team owns the project** — the ids in `.vercel/` are
  opaque.
- **The custom domain** and where its DNS is managed.
- **Which Google account owns the Cloud project** holding the service account,
  and the alumni spreadsheet itself.

**If you are handing this site over, write those four answers down here.**
Everything else in these docs can be re-derived from the code. This can't.
