---
name: run-app
description: Launch the Psi Omega website (Next.js) and screenshot/drive it with headless Chromium. Use when asked to run the app, visually verify a UI change, or screenshot a page/component. Covers the dev-server setup, env vars for the database feature, browser setup, and driving/screenshotting.
---

# Run the Psi Omega site + screenshot it

Use this when you need a *rendered* UI (screenshots, click paths) — not just lint/type checks. `bun check-types` covers types; this covers "does it actually look/behave right."

## The site runs open by default

This is a public marketing site — no auth, no backend of its own. Every page renders from hardcoded data in `lib/` except:

- **`/database`** — a password gate in the UI (`components/database/Database.tsx`), and the sheet route needs `GOOGLE_SHEET_ID` + `GOOGLE_APPLICATION_CREDENTIALS` in `.env` (the credentials var holds the service-account **JSON string**, not a path). Without them, only that route fails — every other page is fine.

## Launch Next.js

```bash
cd /workspace && bun run dev   # next dev --turbopack on http://localhost:5174 (run in background)
```

Poll for readiness (portable — don't assume `curl`):

```bash
timeout 60 bash -c 'until node -e "fetch(\"http://localhost:5174\").then(()=>process.exit(0)).catch(()=>process.exit(1))"; do sleep 1; done'
```

Stop with `pkill -f "next dev"`.

## Browser setup — install OUTSIDE the repo

Playwright is a **dev-only tool, not a project dependency** — never add it to `package.json`. Install it into your session scratchpad:

```bash
mkdir -p "$SCRATCH/pw" && cd "$SCRATCH/pw" && npm init -y && npm install playwright
```

`$SCRATCH` = the session scratchpad directory from the system prompt.

- **macOS host:** Playwright's bundled Chromium works out of the box — `npx playwright install chromium`, then launch with no `executablePath`.
- **Linux container (e.g. COI sandbox):** the bundled Chromium may miss libs. Install the system package (`sudo apt-get install -y chromium`) and pass `executablePath` + `--no-sandbox` (see the template's commented lines).

## Drive + screenshot

Run from `$SCRATCH/pw`. Routes: `/` (home), `/about-akpsi`, `/meet-the-brothers`, `/rush-akpsi`, `/events`, `/memories`, `/legacy`, `/database`.

```js
import { chromium } from 'playwright';

const browser = await chromium.launch({
  // executablePath: '/usr/bin/chromium', args: ['--no-sandbox'],  // uncomment on a Linux container
  headless: true,
});
const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
const errors = [];
page.on('console', m => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', e => errors.push(String(e)));

await page.goto('http://localhost:5174/meet-the-brothers', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('text=Executive Committee', { timeout: 30000 }); // first compile is slow — wait-for, never sleep

await page.screenshot({ path: 'page.png', fullPage: true });
// Component crop — match on visible text or a data attr, not Tailwind class substrings:
// await page.locator('text=Committee Chairs').first().screenshot({ path: 'component.png' });

console.log('ERRORS:', errors.length ? errors.join('\n') : 'none');
await browser.close();
```

Then **Read the PNGs and actually look at them.** Check the `ERRORS:` line before declaring success — the shell can render fine while a fetch or animation throws.

To get past the `/database` password gate, `fill` the password input and `click` "Unlock Database" (the accepted password comes from the check-password route — read it/its env var, don't guess).

## Gotchas

- Pages animate in with `motion/react` (`whileInView`, entrance delays up to ~1.5s) — screenshot too early and heroes are mid-fade. Wait for a selector *below* the fold or add a short settle after `waitForSelector`.
- First Turbopack compile of a route is slow → always `waitForSelector`, never a fixed `sleep`.
- Tailwind classes aren't hashed → select on text / `data-*`, not class substrings.
- Don't add Playwright (or any browser driver) to `package.json` — scratchpad only.
- Dark mode is `next-themes` — toggle it in-app (navbar) rather than assuming a default.
- `/database` fetches a live Google Sheet — don't rely on its contents for assertions; every other page is deterministic from `lib/` data.
