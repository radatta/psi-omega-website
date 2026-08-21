# Content updates

Every routine change to this site is a **text edit in `lib/`** plus, sometimes,
**an image dropped in `public/images/`**. You do not need to understand React or
Next.js to do any of it. You need a text editor and the ability to follow a
recipe.

This is the doc you will use most. Each section below is a self-contained
runbook. Find the thing you need to change, follow the steps in order.

## Before you start

Get the site running locally so you can see your changes:

```bash
bun install     # first time only
bun dev         # then open http://localhost:5174
```

**The port is 5174, not 3000.** Leave `bun dev` running in a terminal while you
work — it reloads the page automatically every time you save a file.

If `bun install` or `bun dev` fails, see `getting-started.md`.

### The one rule that matters

**Data and image go in together, in the same change.**

Almost every content list in this repo pairs a text entry with a file in
`public/images/`. Add one without the other and the page renders a broken image
with no error message anywhere — not in the terminal, not in the browser
console. Nothing tells you. You just get a blank box that a prospective member
sees.

Every runbook below is written to keep those two steps adjacent. Don't split
them across days.

## Add a new pledge class

Do this once per term, after the new class is initiated. Three steps: data,
photos, page section.

### Step 1 — add the roster to `lib/brothers_data.ts`

Each pledge class is one exported array. Classes are named after Greek letters
that advance one per term, alternating Fall and Winter:

| Array          | Class       |
| -------------- | ----------- |
| `alphaOmicron` | Fall 2023   |
| `alphaPi`      | Winter 2024 |
| `alphaRho`     | Fall 2024   |
| `alphaSigma`   | Winter 2025 |
| `alphaTau`     | Fall 2025   |
| `alphaUpsilon` | Winter 2026 |

So the next one is **`alphaPhi`, Fall 2026**, then `alphaChi` for Winter 2027,
and so on down the Greek alphabet.

Open `lib/brothers_data.ts`, scroll to the bottom of the last class array, and
add a new block in the same shape:

```ts
// Data for Alpha Phi | Fall 2026
export const alphaPhi = [
    { name: 'Jane Doe', major: 'Finance', year: '2030' },
    { name: 'John Smith', major: 'Computer Science', year: '2029' },
];
```

Three fields, all strings:

- **`name`** — the brother's full name. **This is also the filename of their
  photo** (see step 2). Get it right.
- **`major`** — shown under the name on the card. Double majors are written out
  in full: `'Finance & Computer Science'`.
- **`year`** — graduation year, as a string in quotes: `'2029'`, not `2029`.

> **`year` is currently not displayed anywhere.** The card ignores it. Fill it in
> anyway — it's the only place the chapter records it, and it costs nothing.

### Step 2 — add one photo per brother

The card builds the image path **from the `name` field**, by replacing spaces
with hyphens and adding `.jpg`:

| Roster `name`  | Required file                           |
| -------------- | --------------------------------------- |
| `'Jane Doe'`   | `public/images/brothers/Jane-Doe.jpg`   |
| `'John Smith'` | `public/images/brothers/John-Smith.jpg` |

The match must be **exact** — same capitalisation, same spelling, `.jpg`
extension (not `.jpeg`, not `.png`). A mismatch gives you a broken image and no
error.

Names with hyphens, apostrophes, or three parts follow the same rule: only
spaces become hyphens, everything else is kept as-is. `'Mary-Kate O'Brien'`
needs `Mary-Kate-O'Brien.jpg`.

Photos need resizing before they go in — see
[the photo pipeline](#the-photo-pipeline) below.

### Step 3 — add the section to the page

The roster array does nothing until a section on the page renders it. Open
`app/meet-the-brothers/page.tsx`.

At the top, add your new class to the import list:

```ts
import {
    executiveCommittee,
    committeeChairs,
    alphaOmicron,
    // ... the rest ...
    alphaUpsilon,
    alphaPhi, // <- add this
} from '@/lib/brothers_data';
```

Then scroll to the very bottom of the file, to the last `</section>` before
`</main>`. Copy the whole `<section>` block above it and paste it after, then
change exactly three things: the background class, the array name, and the
heading text.

```tsx
<section className='py-16 bg-gray-50'>
    <div className='container'>
        <motion.h2
            className='text-4xl font-bold text-center mb-12'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: '100px' }}
        >
            ALPHA PHI | FALL 2026
        </motion.h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {alphaPhi.map((member, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.6,
                        delay: index * 0.1,
                    }}
                    viewport={{ once: true, margin: '200px' }}
                >
                    <BrotherCard {...member} />
                </motion.div>
            ))}
        </div>
    </div>
</section>
```

The `className` on the section alternates `py-16 bg-white` and
`py-16 bg-gray-50` down the page so the classes are visually separated. Look at
what the section above yours uses and pick the other one.

> The pledge classes alternate cleanly. The two sections above them don't —
> EXECUTIVE COMMITTEE is `bg-white` and COMMITTEE CHAIRS has no `bg-*` at all,
> so it inherits white and the two run together. Don't copy that pair as your
> template.

### Step 4 — check it

With `bun dev` running, open <http://localhost:5174/meet-the-brothers> and
scroll to your new section. Confirm **every** card shows a face, not a blank
box. Count them against your roster.

Then run the checks that the commit hook will run anyway:

```bash
bun check-types
bun lint
```

## The photo pipeline

Brother photos arrive from the photographer as ~25MB JPGs, usually via Google
Drive. They cannot go on the site at that size — the page would take a minute to
load on phone data, which is exactly how a prospective member is looking at it.

Target: **max 1600px on the long edge, roughly 100KB per file.**

This needs ImageMagick (`magick`). On macOS: `brew install imagemagick`.

Put the raw downloads in a folder, then:

```bash
mkdir -p out
for f in raw/*.jpg; do
    magick "$f" -auto-orient -resize '1600x1600>' -strip \
        -define jpeg:extent=100KB "out/$(basename "$f")"
done
```

What the flags do:

- **`-auto-orient`** — applies the camera's rotation tag so portraits aren't
  sideways. Skip this and half the class is lying down.
- **`-resize '1600x1600>'`** — shrink to fit 1600px. The `>` means _only shrink,
  never enlarge_, so an already-small photo is left alone.
- **`-strip`** — drops EXIF metadata. Smaller files, and it removes GPS
  coordinates and camera serial numbers from a public website.
- **`-define jpeg:extent=100KB`** — compress to about 100KB.

Then rename each file to `First-Last.jpg` matching the roster name exactly, and
move them into `public/images/brothers/`.

Do the rename carefully — this is where mistakes happen. Check your work:

```bash
ls public/images/brothers/ | wc -l
```

That count should equal the number of distinct people across all pledge-class
arrays, the executive committee, and any committee chair who isn't also in a
class. It is 96 as of Winter 2026.

Use `localNotes/` for the raw downloads and the `out/` folder. It's gitignored,
so the 25MB originals will never be committed by accident.

## Update the executive committee

Once a year, after elections. Open `lib/brothers_data.ts` and edit the
`executiveCommittee` array at the top:

```ts
export const executiveCommittee = [
    { name: 'Fiona Holdaway', position: 'President' },
    { name: 'Maggie Bowes', position: 'VP of Membership' },
];
```

Two fields: `name` and `position`. There is no `major` and no `year`.

**Exec members are rendered with photos**, using the same name-derived path rule
as pledge classes. Every exec member needs
`public/images/brothers/First-Last.jpg`. In practice they usually already have
one from their pledge class — check before you go asking for a headshot:

```bash
ls public/images/brothers/ | grep -i "lastname"
```

If they're an existing brother, the photo is already there and you're done.

## Update the committee chairs

Open `lib/brothers_data.ts` and edit the `committeeChairs` array:

```ts
export const committeeChairs = [
    { name: 'Sanjana Badami + Isha Nag', position: 'Fundraising' },
    { name: 'Kyle Poon + Hyatt Tullu', position: 'Service' },
];
```

**Chairs are text-only — no photos.** This section renders the position and the
name as plain text, so you can put whatever you like in `name`. Co-chairs are
written as one string joined with `+`, which is why the paired entries look
the way they do. No image file is needed and none is looked up.

This is the one roster edit with no photo step. Data only.

## Letter from the president

Written by each incoming president. Unlike everything else, this text is **not**
in `lib/` — it's inline in the homepage.

Open `app/page.tsx` and find the section marked
`{/* President Letter Section */}` (around line 90). Three things to change:

1. **The body text** — several `<p>` paragraphs inside the section.
2. **The signature** — the president's name, near the bottom of the section.
3. **The photo** — `src='/images/brothers/Kyle-Chew.jpg'`. Point it at the
   new president's existing brother photo. They will already have one.

Edit only the text between the tags. Leave the `<p>`, `<div>`, and `className`
parts alone.

## Rush — each term

The highest-stakes update on the site. If rush dates are stale, the site is
actively costing the chapter members.

Everything lives in one small file, `lib/rush_data.ts`:

```ts
export const currentRushData = {
    rushName: 'Winter Rush 2026',
    rushDate: 'January 12th - January 16th',
    rushWeek: 'Week 2 of Winter Quarter',
    rushFlyer: '/images/rush/rush-flyer.png',
    rushMailingList: 'https://docs.google.com/forms/d/e/1FAIpQLS.../viewform',
    rushApplication: {
        link: 'https://docs.google.com/forms/d/e/1FAIpQLS.../viewform',
        dueDate: 'January 14th @ 5:00 PM',
    },
};
```

Update all seven values every term:

| Field                     | Notes                                        |
| ------------------------- | -------------------------------------------- |
| `rushName`                | Also used as the flyer's alt text            |
| `rushDate`                | Free text, shown as written                  |
| `rushWeek`                | Free text, e.g. `'Week 2 of Winter Quarter'` |
| `rushFlyer`               | Path under `public/` — replace the image too |
| `rushMailingList`         | Google Form URL for the interest list        |
| `rushApplication.link`    | Google Form URL for the application          |
| `rushApplication.dueDate` | Free text deadline                           |

Two things to get right:

- **Replace the flyer image.** Drop the new flyer at
  `public/images/rush/rush-flyer.png`, same filename, and it's picked up
  automatically. If you use a different filename, update `rushFlyer` to match.
- **Test both Google Form links** by clicking them on the running site. A form
  set to "not accepting responses" still returns a working-looking page — open
  it and confirm you can actually fill it out.

Setting `rushApplication.link` to an empty string `''` hides the application
button. That's the correct way to take the application down between terms —
don't delete the field.

## Memories photo wall

`lib/memories_data.ts` is one long list:

```ts
export const memoriesPhotosPaths = [
    { src: '/images/memories/memory_1.jpg', alt: 'Memory image' },
    { src: '/images/memories/memory_2.jpg', alt: 'Memory image' },
];
```

To add photos: drop the files in `public/images/memories/` and add one line each
to the array. Filenames are `memory_N.jpg` by convention — the numbers are not
contiguous and nothing depends on them being in order, so just pick a number
above the highest one in use.

Run the photo pipeline on these too. There are 141 of them; a few oversized
files here are what makes the page slow.

Two behaviours that will confuse you if you don't know about them:

- **The wall shuffles randomly on every page load.** Your new photo is in there;
  reload a few times if you don't see it.
- **On mobile, only the first 50 photos in the array are shown** (a deliberate
  performance cap). If you want a new photo to appear on phones, add it near the
  top of the array rather than the bottom.

`alt` is currently the same placeholder string on all 141 entries. If you're
adding photos, write a real description — it's what screen readers announce.

## Event galleries

The events page has three galleries and, unusually, the lists are **inline in
the page file** rather than in `lib/`. Open `app/events/page.tsx` — the three
arrays are at the top:

```ts
const brotherhoodImages = [
    { src: '/images/events/Brotherhood-1.jpg', alt: 'Brotherhood event' },
];
const serviceImages = [...];
const professionalImages = [...];
```

Filenames follow `Category-N.jpg` in `public/images/events/`. Add the file, add
the line, write real `alt` text.

## Company logos

The legacy page shows where alumni have worked. `lib/legacy_data.ts`:

```ts
export const companies = [
    { name: 'Accenture', logo: 'accenture.jpg' },
    { name: 'Addepar', logo: 'Addepar.png' },
];
```

Note `logo` is **just the filename**, not a full path — the page prepends
`/images/companies/`. Drop the logo file in `public/images/companies/` and add
the line.

Filenames here follow no convention at all (`amazon.jpg`, `Addepar.png`,
`Applied-Materials.jpg`). Don't try to fix that; just copy the filename you
actually used into the `logo` field, exactly, including its extension and
capitalisation.

Logos are displayed on white, so prefer a PNG with a transparent background.

## Homepage sponsors

The four sponsor logos on the homepage are a separate, hardcoded list — not
`legacy_data.ts`, though it reuses the same image folder. In `app/page.tsx`,
find `{/* Sponsors Section */}` (around line 358):

```tsx
{
    src: '/images/companies/deloitte.png',
    alt: 'Deloitte',
    name: 'Deloitte',
    href: 'https://www2.deloitte.com/us/en/careers/careers.html',
    delay: 0.2,
},
```

`delay` staggers the fade-in animation; keep the values spread out between
roughly 0.2 and 1.0.

## Checking your work

Before you commit, run both:

```bash
bun check-types
bun lint
```

These also run automatically when you commit, and a failure **blocks the
commit** — so running them yourself first saves you a confusing rejection.

If `bun lint` complains about formatting (spacing, quotes, line length), don't
fix it by hand:

```bash
bun format
```

Then **look at the page in the browser.** Types and lint cannot tell you that a
photo is missing or a name is misspelled — the two most common mistakes in every
runbook above. Open the page you changed and actually look at it.

### Verifying nothing is missing

To check every roster name has a matching photo before you commit:

```bash
# names in the data (excluding the paired committee chairs)
grep -o "name: '[^']*'" lib/brothers_data.ts \
    | sed "s/name: '//;s/'//" | grep -v ' + ' \
    | sed 's/ /-/g;s/$/.jpg/' | sort -u > /tmp/names.txt

# photos on disk
ls public/images/brothers/ | sort > /tmp/photos.txt

# anything in the first list but not the second is a broken card
comm -23 /tmp/names.txt /tmp/photos.txt
```

That last command should print nothing. Anything it prints is a brother whose
card will render as a blank box.
