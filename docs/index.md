# Docs

Start here. One line per doc — open the one that matches what you're doing.

| Doc                                      | When you need it                                                              |
| ---------------------------------------- | ----------------------------------------------------------------------------- |
| [getting-started.md](getting-started.md) | First time on this repo. Install, run locally, `.env`, the pre-commit hook.   |
| [content-updates.md](content-updates.md) | **Most edits live here.** Rosters, photos, rush dates, galleries, sponsors.   |
| [architecture.md](architecture.md)       | What's where, and the conventions that aren't obvious from reading the code.  |
| [database.md](database.md)               | The alumni Google Sheet: setup, the header contracts, why it isn't protected. |
| [deployment.md](deployment.md)           | Branches, PR previews, Vercel env vars, rolling back a bad deploy.            |

The site's content is plain TypeScript in `lib/*_data.ts` and images in
`public/images/` — no CMS. Almost every update is a text edit plus an image
file, and the two must land together.
