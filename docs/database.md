# The alumni database

The `/database` page is the only part of this site that isn't static. It reads a
Google Sheet of alumni — employers, roles, contact details — and renders it as a
sortable, searchable table.

Because it's the only moving part, it's also the only thing that breaks on its
own. This doc covers how it works, how to set it up, and the ways it fails
quietly.

## Read this first: the page is not actually protected

The `/database` page shows a password box. **It does not protect anything.**

- The password check happens in the browser. A visitor who declines to type a
  password can still read the data.
- The API route that returns the spreadsheet, `GET /database/api/sheet`, has
  **no authentication at all**. Anyone who knows the URL can fetch the entire
  alumni sheet as JSON, from anywhere, with no password.
- The password itself is written literally in the source code, in
  `app/database/api/check-password/route.ts`. This repository is **public on
  GitHub**, so the password is public too, and has been since the feature
  shipped.

**Treat everything in that spreadsheet as world-readable.** Do not add anything
to it — home addresses, phone numbers, personal notes about alumni — on the
assumption that the password gate is keeping it private. It isn't.

Fixing this is tracked work, not a hypothetical. When it lands, this section
gets rewritten and the setup below gains a third environment variable.

## How it works

```
Browser  ──>  /database/api/sheet  ──>  Google Sheets API  ──>  the spreadsheet
                (Next.js route)          (service account,
                                           read-only)
```

1. The visitor types a password. The browser posts it to
   `/database/api/check-password`, which compares it and returns
   `{ success: true }`.
2. On success, the browser fetches `/database/api/sheet`.
3. That route authenticates to Google as a **service account** — a robot Google
   account with its own credentials — and reads the sheet.
4. The rows come back as a plain grid of strings, and the table is built from
   them in the browser.

The service account has **read-only** access. Nothing the site does can modify
the spreadsheet.

Four files are involved:

| File                                       | Job                                      |
| ------------------------------------------ | ---------------------------------------- |
| `app/database/api/sheet/route.ts`          | Talks to Google, returns the rows        |
| `app/database/api/check-password/route.ts` | The password check                       |
| `components/database/Database.tsx`         | Password form, fetch, row transformation |
| `components/database/columns.tsx`          | Turns sheet headers into table columns   |

## Setting it up

You need two things: a Google service account with a key, and that key in your
`.env`.

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
GOOGLE_SHEET_ID=1AbC...
GOOGLE_APPLICATION_CREDENTIALS={"type":"service_account",...}
```

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

In `components/database/Database.tsx`:

```ts
const filtered = fetchedData.filter(
    (row, idx) => idx === 0 || (row && row[4] && String(row[4]).trim() !== '')
);
```

**Any row with an empty column E is dropped from the table.** It's there to skip
blank spacer rows, but it's positional — it checks the fifth column, whatever
that column happens to be. Insert or delete a column to the left of E and the
filter starts testing a different field, and rows will vanish for reasons nobody
can see.

If an alum is missing from the table and you're sure they're in the sheet: check
column E of their row.

### Header names are matched exactly

`components/database/columns.tsx` special-cases specific header strings.
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

Two details worth knowing:

- The two `Open to ...?` headers are matched **case-sensitively**, including the
  question mark. `Open To Coffee Chats?` does not match.
- Cell values for those columns are compared in lowercase, so `Yes`, `yes`, and
  `YES` all work. Anything that isn't `yes`, `no`, or `maybe` is shown as raw
  text, and an empty cell shows `-`.

**Before renaming a column in the spreadsheet, check this table.** If you must
rename one, update `columns.tsx` in the same change.

## When it breaks

**"Loading data or no data available..." forever** — the fetch failed or came
back empty. Open your browser's developer console (F12) and look at the Network
tab for `/database/api/sheet`. The response body usually names the problem.

**The app won't start at all** — if either environment variable is missing, the
route throws at module load and takes the whole server down, not just the
database page. Check `.env` exists and has both keys.

**`Unexpected token . in JSON`** or similar on startup —
`GOOGLE_APPLICATION_CREDENTIALS` is set to a file path instead of the file's
contents. See above.

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

- The database components are typed as `any` throughout, with file-level
  `eslint-disable` comments. That's existing debt — don't copy the pattern into
  new files.
- `components/database/DataTable.tsx` is dead code, superseded by
  `data-table.tsx`. The two differ only in the capitalisation of the filename,
  which is a genuine hazard on macOS. Don't edit the wrong one.
