# The alumni database

The `/database` page is the only part of this site that isn't static. It reads a
Google Sheet of alumni — employers, roles, contact details — and renders it as a
sortable, searchable table.

Because it's the only moving part, it's also the only thing that breaks on its
own. This doc covers how it works, how to set it up, and the ways it fails
quietly.

## Read this first: rotate the password

The gate is now enforced on the server (see [Access control](#access-control)),
but **the password that preceded this fix is still in this repository's git
history**. It was written literally in
`app/database/api/check-password/route.ts` from the day the feature shipped
until it was moved to an environment variable.

Removing it from the source does not unpublish it. Anyone who cloned or browsed
the public repo has it.

**Set `DATABASE_PASSWORD` to a new value** in `.env` and in Vercel before
treating the page as protected. Until you do, assume the sheet is readable by
anyone who has read the repo.

Separately: the spreadsheet has been effectively public for the life of the
feature, so audit what's in it. If anything sensitive was added on the
assumption that the gate worked — home addresses, phone numbers, private notes
— treat it as already disclosed.

## Access control

Both halves of the gate are server-side.

- `POST /database/api/check-password` compares the submitted password against
  `DATABASE_PASSWORD` with a constant-time comparison, and on success sets an
  **HttpOnly** session cookie scoped to `/database`. JavaScript in the page
  cannot read it.
- `GET /database/api/sheet` verifies that cookie and returns **401** without it.
- The cookie is `expiry.fingerprint.signature`, signed with HMAC-SHA256 under
  **`DATABASE_SESSION_SECRET`** — a random value, separate from the password.
  This matters: if the cookie were signed with a key derived from the password,
  a stolen cookie could be used to brute-force the password offline. It can't.
- The `fingerprint` is an HMAC of the password under the same secret, so
  **changing `DATABASE_PASSWORD` invalidates every outstanding session** without
  the cookie ever being a crackable function of the password.
- Sessions last 12 hours.
- Failed logins are rate limited per client IP (10 per 15 minutes), then 429.
  See the caveat in `lib/server/rate-limit.ts`: the counter is per serverless
  instance, so it raises the cost of online guessing rather than capping it
  absolutely.
- Responses from the sheet route are sent `Cache-Control: no-store`, so no CDN
  or browser keeps a copy of alumni contact details.
- **It fails closed.** If either `DATABASE_PASSWORD` or
  `DATABASE_SESSION_SECRET` is unset, every login is refused and the sheet route
  returns 503 — it never falls back to a default.

Signing and verification live in `lib/server/session.ts` — under `lib/server/`,
not `lib/utils/`, so a stray import can't pull `node:crypto` and this logic into
a client bundle. Two test files cover it: `tests/session.test.ts` for the token
scheme (forged signatures, tampered fingerprints, extended expiries, malformed
input) and `tests/database-routes.test.ts`, which calls the real route handlers
and asserts the sheet route 401s without a valid cookie. That second file is the
one that would catch someone deleting the check from the route.

**There is no logout.** A session ends when it expires after 12 hours, or when
the password is rotated. If a laptop with an open session goes missing, rotating
`DATABASE_PASSWORD` is the way to revoke it.

What this is _not_: there are no individual user accounts, and no audit trail of
who looked at what. It is one shared password for the whole chapter. Anyone who
has it, and anyone they forward it to, can read the whole sheet.

## How it works

```
Browser  ──>  /database/api/sheet  ──>  Google Sheets API  ──>  the spreadsheet
                (Next.js route)          (service account,
                                           read-only)
```

1. The visitor types a password. The browser posts it to
   `/database/api/check-password`, which compares it against
   `DATABASE_PASSWORD` and, on a match, sets a signed HttpOnly session cookie.
2. The browser fetches `/database/api/sheet`. The cookie rides along
   automatically; without a valid one the route returns 401 and the page drops
   back to the password form.
3. That route authenticates to Google as a **service account** — a robot Google
   account with its own credentials — and reads the sheet.
4. The rows come back as a plain grid of strings, and the table is built from
   them in the browser.

The service account has **read-only** access. Nothing the site does can modify
the spreadsheet.

Eight files are involved:

| File                                       | Job                                      |
| ------------------------------------------ | ---------------------------------------- |
| `app/database/api/sheet/route.ts`          | Checks the session, talks to Google      |
| `app/database/api/check-password/route.ts` | Checks the password, issues the session  |
| `lib/server/session.ts`                    | Signs and verifies the session cookie    |
| `lib/server/rate-limit.ts`                 | Throttles repeated failed logins         |
| `lib/database/sheet.ts`                    | Turns the sheet grid into row objects    |
| `lib/database/column-spec.ts`              | Decides what each sheet header becomes   |
| `components/database/Database.tsx`         | Password form and fetch                  |
| `components/database/columns.tsx`          | Renders those decisions as table columns |

## Setting it up

You need two things: a Google service account with a key, and that key in your
`.env`. Start from `.env.example` in the repo root — it lists every variable
with notes.

### 1. Create the service account

In the [Google Cloud Console](https://console.cloud.google.com/):

1. Create a project, or open the existing chapter one.
2. Enable the **Google Sheets API** for it.
3. Go to **IAM & Admin → Service Accounts** and create one. No roles are needed
   — access is granted on the spreadsheet itself, in step 3 below.
4. Open the service account, go to **Keys → Add Key → Create new key → JSON**,
   and download the file.

That downloaded file is a credential. Treat it like a password.

### 2. Share the spreadsheet with it

Open the JSON file and find `client_email`. It looks like
`something@your-project.iam.gserviceaccount.com`.

Open the alumni spreadsheet in Google Sheets, click **Share**, and share it with
that address as a **Viewer**.

Skipping this step is the second most common setup mistake. The credentials will
be perfectly valid and Google will return a 403, because the robot account
genuinely has not been given access to the file.

### 3. Put it in `.env`

```bash
DATABASE_PASSWORD=a-long-random-passphrase
DATABASE_SESSION_SECRET=64-hex-characters-from-openssl-rand
GOOGLE_SHEET_ID=1AbC...
GOOGLE_APPLICATION_CREDENTIALS={"type":"service_account",...}
```

**`DATABASE_PASSWORD`** is the shared password for the page. Make it a long
random passphrase rather than a word — it is the only thing between the public
and the alumni sheet, and it gets forwarded around by hand. See
[the rotation note](#read-this-first-rotate-the-password) above before reusing
the old one.

**`DATABASE_SESSION_SECRET`** signs the session cookie. It must be random, and
must not be the password. Generate one with `openssl rand -hex 32`.

Both are required — missing either makes the page fail closed.

**`GOOGLE_SHEET_ID`** is the long id from the spreadsheet URL:

```
https://docs.google.com/spreadsheets/d/1AbC.../edit
                                      ^^^^^^ this part
```

**`GOOGLE_APPLICATION_CREDENTIALS`** is **the entire contents of the JSON key
file**, on one line — not a path to it. This is the opposite of what the
variable means everywhere else in Google's tooling, and it catches everyone.

```bash
jq -c . your-downloaded-key.json
```

Paste that output as the value, unquoted.

Then restart `bun dev` — env vars are only read at startup.

Keep the key file itself out of the repo. `google-service-account.json` is
already in `.gitignore`; leave it there.

## The spreadsheet contracts

The code makes several assumptions about the sheet that are **not validated and
not reported**. Break one and the page degrades silently — no error in the
browser, nothing in the terminal, just wrong or missing data.

### The tab must be named `Sheet1`

The read range is hardcoded in `app/database/api/sheet/route.ts`:

```ts
const range = 'Sheet1!A1:O1000';
```

Renaming the tab breaks the page entirely. This also caps the read at **columns
A–O (15 columns)** and **1000 rows** — add a 16th column or a 1001st alum and
the extra data is invisible until someone widens that range.

### Row 1 is the header row

Everything downstream is keyed off the exact text in row 1. A blank header cell
becomes an internal name like `_col_3`.

### Column E decides whether a row exists

In `lib/database/sheet.ts` (excerpt — inline comments trimmed):

```ts
// The sheet keeps trailing blank rows and half-filled drafts. A row only counts
// as real if this column is filled in. Positional and brittle — it does not
// follow the header if someone reorders the spreadsheet.
export const REQUIRED_COLUMN_INDEX = 4;

export function filterPopulatedRows(grid: SheetGrid): SheetGrid {
    return grid.filter((row, index) => {
        if (index === 0) return true; // always keep the header row
        const cell = row?.[REQUIRED_COLUMN_INDEX];
        return Boolean(cell) && String(cell).trim() !== '';
    });
}
```

**Any row with an empty column E is dropped from the table.** It's there to skip
blank spacer rows, but it's positional — it checks the fifth column, whatever
that column happens to be. Insert or delete a column to the left of E and the
filter starts testing a different field, and rows will vanish for reasons nobody
can see.

**This is not a rare edge case.** Column E is currently `EMAIL` — the filter
doesn't know that, which is the whole point of the warning above, but it is what
column E holds today. Counted on 2026-08-22, the sheet held 370 named rows and
only **85** had an email, so the table shows 85 people and omits 285.

That is mostly working as intended. Those 285 rows are not blank — they have a
name and a pledge class — but every column the table exists to show is empty for
them, so they would render as a name followed by nothing. Fill counts from the
same pass, out of 378 data rows:

| Column       | Filled |
| ------------ | ------ |
| `LAST`       | 370    |
| `FIRST`      | 370    |
| `YEAR + PC`  | 378    |
| `EMAIL`      | 85     |
| `MAJOR`      | 86     |
| `GRAD YEAR`  | 86     |
| `ROLE`       | 85     |
| `COMPANY`    | 85     |
| `LOCATION`   | 85     |
| `INDUSTRY`   | 85     |
| `LINKEDIN`   | 84     |
| coffee chats | 84     |
| alumni panel | 84     |

The practical consequence: this page is a directory of the alumni who filled out
the form, not of the alumni the chapter has on record. Worth knowing before
anyone reports the table as "missing people." Note `MAJOR` and `GRAD YEAR` are
86, one ahead of `EMAIL` — so exactly one person has partial details and is
still dropped.

If an alum is missing from the table and you're sure they're in the sheet: check
column E of their row.

### Recounting the alumni total

`components/about/statistics-section.tsx` hardcodes `totalAlumni`, because the
repo has no alumni list to derive it from. The number comes from this sheet, and
the derivation matters: **the sheet is a chapter directory, not an alumni list.**
On 2026-08-22 it held 369 unique names, of which **72 were current active
brothers** — so alumni-on-record was 369 − 72 = **297**. Counting rows and
calling it the alumni total would overstate it by roughly the size of the active
chapter.

To recount, log in and compare unique `FIRST LAST` in the sheet against
`activeBrothers` in `lib/utils/roster.ts`. Match on normalised names and expect
a few off-by-ones from nicknames and changed surnames.

Two other things that count showed, both for a human to fix in the spreadsheet
rather than in code: one name is entered twice, and eight rows carry a
`YEAR + PC` label with no name (pledge-class section dividers).

### Header names are matched exactly

`lib/database/column-spec.ts` special-cases specific header strings, and
`components/database/columns.tsx` renders what it decides.
**Renaming any of these in the spreadsheet silently removes its formatting** —
the column still appears, but as plain unstyled text.

| Header in the sheet     | What it gets                                          |
| ----------------------- | ----------------------------------------------------- |
| `EMAIL`                 | Pinned as the first column, fixed width               |
| `LINKEDIN`              | Rendered as a clickable link                          |
| `Open to coffee chats?` | ☕ header, green/red/yellow icon for yes / no / maybe |
| `Open to alumni panel?` | 👥 header, same icon treatment                        |
| `GRAD YEAR`             | Sortable, narrow width                                |

These are sortable, matched case-insensitively:

`LAST`, `FIRST`, `YEAR + PC`, `MAJOR`, `MINORS`, `COMPANY`, `LOCATION`,
`INDUSTRY`, `ROLE`

Anything else becomes a plain, unsortable text column.

Three details worth knowing:

- The two `Open to ...?` headers are matched **case-sensitively**, including the
  question mark. `Open To Coffee Chats?` does not match.
- Cell values for those columns are compared in lowercase, so `Yes`, `yes`, and
  `YES` all work. Anything that isn't `yes`, `no`, or `maybe` is shown as raw
  text (lowercased), and an empty cell shows `-`.
- Surrounding whitespace is ignored when matching, so the sheet's actual
  `YEAR + PC ` (with a trailing space) still works. The column _key_ keeps the
  raw header, spaces and all.

**Before renaming a column in the spreadsheet, check this table.** If you must
rename one, update `lib/database/column-spec.ts` in the same change — and
`tests/database-sheet.test.ts` will tell you if you miss it.

## When it breaks

**"Loading data or no data available..." forever** — the fetch failed or came
back empty. Open your browser's developer console (F12) and look at the Network
tab for `/database/api/sheet` and check its status code:

| Status | Meaning                                                           |
| ------ | ----------------------------------------------------------------- |
| 401    | No valid session — log in again                                   |
| 503    | A required environment variable is missing                        |
| 502    | The Google call failed (bad credentials, no access, or an outage) |

The response body is deliberately a bare code (`not_configured`,
`unauthorized`, `upstream_failure`) rather than a description — the real reason
is written to the **server** log, so it never leaks to a visitor. Look there,
or in Vercel's function logs, for the detail.

**A missing environment variable no longer stops the site.** It used to throw at
module load and fail the whole build; now only `/database` breaks, with a 503.

**`Unexpected token . in JSON`** or similar in the server log —
`GOOGLE_APPLICATION_CREDENTIALS` is set to a file path instead of the file's
contents. That surfaces as a 502 when someone loads the page, not at startup.
See above.

**403 from Google** — the spreadsheet hasn't been shared with the service
account's `client_email`. See step 2.

**404 from Google** — `GOOGLE_SHEET_ID` is wrong, or the tab isn't named
`Sheet1`.

**Some alumni are missing** — column E is empty for those rows, or they're below
row 1000.

**A column lost its icons or links** — someone renamed a header in the
spreadsheet. Compare against the table above.

## Working on this code

If you're changing these files, two things to know:

- The transformation logic is pure and lives in `lib/database/`, covered by
  `tests/database-sheet.test.ts`. Put new logic there rather than inside the
  components, and add a test — it's much cheaper than checking by eye.
- `components/database/data-table.tsx` is still typed loosely with a file-level
  `eslint-disable`. That's existing debt — don't copy the pattern into new
  files.
