# Home page background video (parked)

Status: prototyped Sep 2026, pulled before merge. Pick this up with the `Plan`
agent — this doc is the starting point, not the design.

## The idea

Swap the home hero's still (`public/images/hero.png`) for a muted, looping,
autoplaying background video — the pattern on https://akpsi.chapstu.org: full
bleed, dark overlay, headline + CTA on top, a small pause button bottom-right.

Our hero already has the layout (full-bleed `Image`, `bg-black/50` overlay,
centered text, scroll chevron in `app/page.tsx`). The only change is the
background layer.

## What the prototype did

- **Video:** the fall-26 rush edit (same clip as the rush page), re-encoded:

    ```bash
    ffmpeg -i AKPSIEDITFINAL.mov -map 0:v:0 -map_metadata -1 -t 14.75 -an \
        -vf "scale=1280:-2,format=yuv420p" -c:v libx264 -preset slow -crf 26 \
        -movflags +faststart public/videos/rush.mp4
    ```

    The source is an iPhone HEVC `.mov` (won't play in Chrome), 19MB with
    audio. H.264 + no audio + trimmed → 4.5MB. `-t 14.75` cuts the black
    `@akpsiscu` end card (found with `ffmpeg -vf blackdetect`), which would
    otherwise flash black on every loop. `+faststart` lets it start before
    fully downloading.

- **Component:** `components/home/hero-video.tsx` replaced the `<Link><Image>`
  and overlay inside the hero's `motion.div`. Final version below.

## Gotchas we hit

- **Hydration mismatch.** v1 hid the `<video>` with `useReducedMotion()` —
  `null` on the server, `true` on a reduced-motion client, so the trees
  differed. Fix: always render the `<video>`, and decide whether to _play_ in a
  `useEffect` via `matchMedia('(prefers-reduced-motion: reduce)')`.
- **Reduced motion looks like "it's broken."** Under that setting the video
  sits paused on its first frame; the play button starts it. Test with the OS
  setting off too.
- **Burned-in text.** The edit has "AKPSI RUSH fall 2026" / "open to all
  majors" baked in; it sits behind the typewriter headline and dates the page.
  There's no clean cut. Options: pick a text-free segment with `-ss`/`-t`,
  blur/darken harder, or get new footage.
- **Aspect.** The clip is ~4:3; `object-cover` on a wide desktop crops the
  top and bottom.
- **Weight.** 4.5MB on the landing page for every visitor. Consider a smaller
  encode (higher `-crf`, 960px wide), a WebM/AV1 `<source>`, and not loading
  the video on small screens at all.

## Prototype component

```tsx
'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

// Muted looping background video. Stays paused under reduced motion.
export const HeroVideo = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [paused, setPaused] = useState(true);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
            return;
        video
            .play()
            .then(() => setPaused(false))
            .catch(() => {});
    }, []);

    const toggle = () => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) video.play();
        else video.pause();
        setPaused(!paused);
    };

    return (
        <>
            <Image
                src='/images/hero.png'
                alt='Alpha Kappa Psi Brotherhood'
                fill
                className='object-cover'
                priority
            />
            <video
                ref={videoRef}
                className='absolute inset-0 h-full w-full object-cover'
                src='/videos/rush.mp4'
                muted
                loop
                playsInline
                preload='auto'
                aria-hidden='true'
            />
            <div className='absolute inset-0 bg-black/50'></div>
            <button
                type='button'
                onClick={toggle}
                className='absolute bottom-8 right-8 rounded bg-black/40 p-2 text-white hover:bg-black/60'
                aria-label={
                    paused ? 'Play background video' : 'Pause background video'
                }
            >
                {paused ? <Play size={18} /> : <Pause size={18} />}
            </button>
        </>
    );
};
```

In `app/page.tsx`, it replaced the hero's `<Link href='/'><Image …/></Link>`
and `<div className='absolute inset-0 bg-black/50'>` with `<HeroVideo />`.
