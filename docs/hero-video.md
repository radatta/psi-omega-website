# Rush video

One video file plays in two places:

- **Home page hero** (`components/home/hero-video.tsx`) — a muted background
  video behind the headline, desktop only. It plays once from the start, end
  card included, then fades out over 2.5s to the `hero.png` still. A sound
  button and a pause button sit bottom-right; once it ends the pause button
  becomes Replay, which restarts it with whatever sound setting the visitor
  chose. While it plays muted, a small arrow fades in after 2s left of the
  sound button and nudges toward it, so visitors notice there's audio; it
  disappears once sound is on, the video is paused, or it ends.
- **Rush page** (`components/rush/rush-video.tsx`) — a normal player that plays
  the whole thing once, end card included. It autoplays muted once the whole
  player is on screen, shows a "Tap for sound" pill, pauses when scrolled off
  screen, and a manual pause (or reaching the end) sticks.

The file is `public/videos/rush-fall-26-v2.mp4` (1080p H.264 + AAC, ~30MB),
referenced once as `rushVideo` in `lib/rush_data.ts`. Using one file means a
visitor who lands on the home page and clicks through to the rush page already
has it cached.

If autoplay is blocked — Safari in **Low Power Mode** blocks it even for muted
video, as does Safari's per-site "Never Auto-Play" — the video waits paused on
its first frame, and after 1.5s a small down arrow bounces above the Play
button until it has actually played. As it refuses, Safari still fires `play`,
`playing` and then `pause`, so "started" means `currentTime` actually advanced
(`timeupdate` past 0.1s), not that a `playing` event arrived. (An earlier
version switched to the finished state here; the `pause` sync undid it,
leaving a bare Play button.) If the file fails to
load, the hero shows its finished state instead: the still and
full-brightness text.

## Phones get the still

Below `(min-width: 1024px)` the hero shows `public/images/hero.png` and nothing
else — no `<video>`, no buttons, nothing downloaded. The name captions baked into
the edit get cut off on a portrait crop, and phones are often on cellular. The
rush page still plays the video on phones.

The breakpoint is checked in a `useEffect`, not during render, so the server
HTML and the first client render match (checking `matchMedia` during render
caused a hydration error in the prototype). Reduced motion is deliberately
ignored — the hero autoplays for everyone.

## Caching and the rename rule

`next.config.ts` serves `/videos/*` with
`Cache-Control: public, max-age=31536000, immutable`, so repeat visitors never
re-check the file. The cost: **a changed video must get a new filename**
(`rush-winter-27.mp4`, …). Overwriting the old file in place means returning
visitors keep the old video for up to a year. `bun test` fails if a `/videos/…`
path in source doesn't exist on disk.

## Bandwidth

Files in `public/` count against Vercel's Fast Data Transfer: **100GB/month on
Hobby**. The site used ~2.5GB in the month before this video shipped. At ~30MB
per visitor who plays it (desktop on the home page, any device on the rush
page, once per browser cache), that's roughly 3,200 first-time plays a month
before the cap. Watch **Vercel → Usage**
during rush week; if it climbs past ~50GB mid-month, re-encode smaller (higher
`-crf`, or `scale=1280:-2`) under a new filename.

Each term's new file also stays in git history for good (deleting the old one
doesn't shrink the repo), so keep encodes around this size. GitHub rejects
files over 100MB.

Vercel has no video optimization equivalent to `next/image`, and Vercel Blob's
Hobby allowance is only 10GB (going over blocks Blob for 30 days), which is why
the file lives in `public/`.

## Re-encoding next term

The source edit stays in `localNotes/` (gitignored). The fall-26 edit mixes
two framings: most shots are a 4:3 picture with black pillarbox bars baked in,
and some (the "AKPSI RUSH FALL 2026" unscramble, a few full-width shots, the
white flashes) fill the whole 16:9 frame. The encode swaps the bars for a
blurred, darkened copy of the same shot, **only on the frames that have bars**
— full-width frames pass through untouched. Blurring every frame cropped the
edges off the full-width shots and the unscramble text.

1. **Proxy + per-frame bar detection** (one read of the big source):

    ```bash
    ffmpeg -i "localNotes/<source>.mov" -an -vf scale=480:270 \
        -c:v libx264 -crf 16 -preset veryfast /tmp/proxy24.mp4
    ffmpeg -i /tmp/proxy24.mp4 -vf "cropdetect=limit=24:round=2:reset=1" \
        -an -f null - 2>&1 | grep cropdetect \
        | sed -E 's/.*x1:([0-9]+) x2:([0-9]+).* t:([0-9.]+) .*/\3 \1 \2/' \
        > /tmp/crops.txt
    ```

2. **Classify frames and build the `enable` expression.** A frame has bars
   when its picture sits inside x=50..430 of the 480-wide proxy; full width
   when it reaches both edges; anything else (black-background text, dissolves)
   takes its neighbour's label. Save as `/tmp/segs.py`, run
   `python3 /tmp/segs.py /tmp/crops.txt /tmp/enable.txt` (keep it a file — the
   COI sandbox kills inline Python one-liners as a "reverse shell"):

    ```python
    import sys
    FPS, N = 24, 1540  # frame count from ffprobe -count_frames
    cls = {}
    for t, x1, x2 in (l.split() for l in open(sys.argv[1])):
        n, x1, x2 = round(float(t) * FPS), int(x1), int(x2)
        cls[n] = 'B' if x1 >= 50 and x2 <= 430 else ('F' if x1 <= 6 and x2 >= 473 else '?')
    lab = []
    for n in range(N):
        c = cls.get(n, '?')
        if c == '?':
            prev = next((cls[k] for k in range(n - 1, -1, -1) if cls.get(k, '?') != '?'), None)
            nxt = next((cls[k] for k in range(n + 1, N) if cls.get(k, '?') != '?'), None)
            c = prev or nxt
        lab.append(c)
    runs = []
    for n, c in enumerate(lab):
        if runs and runs[-1][2] == c: runs[-1][1] = n
        else: runs.append([n, n, c])
    open(sys.argv[2], 'w').write('+'.join(
        f'between(t,{a / FPS - 0.01:.3f},{b / FPS + 0.01:.3f})'
        for a, b, c in runs if c == 'B'))
    ```

    Eyeball a few frames around each change before encoding (`-ss <t> -frames:v 1`
    on the source vs the output).

3. **Encode** with a filter script (the expression is long):

    ```bash
    printf "[0:v]split=2[base][p];[p]crop=1440:1080:240:0,split[fg][b];[b]scale=480:360,crop=480:270,boxblur=12:3,scale=1920:1080,eq=brightness=-0.06[bg];[bg][fg]overlay=240:0[comp];[base][comp]overlay=0:0:enable='%s',format=yuv420p[v]" \
        "$(cat /tmp/enable.txt)" > /tmp/graph.txt
    ffmpeg -i "localNotes/<source>.mov" -map_metadata -1 -map_chapters -1 \
        -filter_complex_script /tmp/graph.txt -map "[v]" -map 0:a:0 \
        -c:v libx264 -preset medium -crf 23 -g 48 -profile:v high \
        -c:a aac -b:a 128k -ac 2 -movflags +faststart \
        public/videos/rush-<term>.mp4
    ```

Why blur instead of cropping the bars: the baked-in name captions sit at the
bottom and faces at the top, so cropping to fill the screen clipped one or the
other. If a new edit has no pillarboxed shots, skip steps 1–2 and encode with
`-map 0:v:0` and no filter. `-map_metadata`/`-map` drop the timecode track
iPhone/Premiere exports carry, `-g 48` puts a keyframe every 2s so scrubbing on
the rush page is cheap, and `+faststart` lets playback start before the whole
file downloads. Then point `rushVideo` in `lib/rush_data.ts` at the new file and
delete the old one. Changed the video? New filename (`rush-<term>-v2.mp4`) — the
cache rule below means the old name keeps serving the old file.

## Play once, fade, replay

The hero has no loop points to tune. It plays the whole file once, the `ended`
event fades the `<video>` to `opacity-0` (2.5s ease-in-out CSS transition)
while the still underneath slowly zooms out from `scale-110`, and the element
stays mounted so Replay is instant from cache. A 1s fade read as a hard cut:
most of it is the black end card dimming into the photo. The pause
button's slot turns into Replay at the end; the sound button stays, so "sound
on, then Replay" plays with audio — `play()` runs synchronously inside the
click, which keeps the user gesture on iOS. The `@akpsiscu` end card
(≈61.4s→64.2s) shows behind the subtitle and the top of Learn More; that
overlap is accepted. Crossing the `lg` breakpoint remounts the element and
starts over from a fresh, not-ended state.

## Hero text brightness ramp

While the video plays, the headline, subtitle and Learn More (one block in
`app/page.tsx`, passed to `HeroVideo` as `textRef`) brighten with it:
`TEXT_START` 75% at 0:00, rising linearly to `TEXT_PEAK` 90% at `END_CARD`
(61.2s), holding at 90% through the end card, then finishing to 100% as the
still fades in. Replay eases it back to 75%. `TEXT_START` must match the text
block's `lg:opacity-75` class in `app/page.tsx` (the first-paint value, so
nothing fades on load). `HeroVideo` writes
`style.opacity` on that element from `timeupdate`/`seeked`/`ended` rather than
through React state, so the page doesn't re-render several times a second; the
block's 2.5s `transition-opacity` matches the video's fade to the still, and
smooths the ~4Hz `timeupdate` steps. Phones (no video) leave the style unset, so
the text is always full. The three constants sit at the top of
`hero-video.tsx`; if a new edit's end card starts elsewhere, update
`END_CARD`.

## Shading behind the text

There is no full-screen tint over the video or the still (the old `bg-black/50`
made the footage dull and soft-looking). Instead two gradients sit only where
text is: a top fade behind the navbar, and a radial shade (70% black at the
centre, clear at the edges) behind the headline, subtitle and Learn More. Much
of the edit is shot against white backdrops, so those shades — together with
the 75%+ text ramp — are what keep the white text readable. Lower either and
check the white-backdrop shots (~0:09, ~0:40).

## Gotchas

- **The source mixes 4:3-with-bars and full-width frames.** The encode blurs
  the sides only on barred frames (above). Don't crop the picture itself — the
  name captions sit at the bottom and faces at the top.
- **Unmute synchronously inside the click handler.** An `await` before
  `video.muted = false` makes iOS drop the gesture and keep it muted.
- **Browsers won't autoplay with sound** until the visitor has interacted with
  the site, so both players start muted.
- **Hero icons and the fade follow the element**, not component guesses: one
  `sync` listener on `play`/`playing`/`pause`/`ended` mirrors `video.paused` and
  `video.ended`. `ended` is already true when the final `pause` event fires,
  so Replay never flashes through Play.
