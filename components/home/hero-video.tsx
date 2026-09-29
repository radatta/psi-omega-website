'use client';

import Image from 'next/image';
import { type RefObject, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
    ArrowRight,
    Pause,
    Play,
    RotateCcw,
    Volume2,
    VolumeX,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { rushVideo } from '@/lib/rush_data';

// The rush edit as a muted background video, desktop only. Same file the rush
// page plays; here it plays once through the end card, fades out to the still,
// and a Replay button brings it back.
// lg breakpoint: laptops and landscape iPads get the 30MB file; phones and
// portrait tablets get the still.
const DESKTOP = '(min-width: 1024px)';

// The hero text starts dim over the footage and brightens linearly to
// TEXT_PEAK by the end card, holds there through it, then finishes to full as
// the still fades in. Set on the element directly so the page doesn't
// re-render per frame. Keep TEXT_START in sync with the text block's
// `lg:opacity-40` baseline in app/page.tsx, so the first paint doesn't fade.
const TEXT_START = 0.4;
const TEXT_PEAK = 0.8;
// The dissolve into the @akpsiscu card starts at 61.21s.
const END_CARD = 61.2;

export const HeroVideo = ({
    textRef,
}: {
    textRef?: RefObject<HTMLDivElement | null>;
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [desktop, setDesktop] = useState(false);
    const [paused, setPaused] = useState(true);
    const [muted, setMuted] = useState(true);
    const [done, setDone] = useState(false);

    // Decided after mount so the server and first client render agree.
    useEffect(() => {
        const query = window.matchMedia(DESKTOP);
        // A remounted video starts fresh, so drop any finished state.
        const update = () => {
            setDesktop(query.matches);
            setDone(false);
        };
        update();
        query.addEventListener('change', update);
        return () => query.removeEventListener('change', update);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = true;
        setMuted(true);
        // Icons and the fade follow the element, not our guesses. `ended` is
        // already true when the final pause event fires, so Replay never
        // flashes through Play.
        const sync = () => {
            setPaused(video.paused);
            setDone(video.ended);
        };
        sync();
        const setText = (opacity: string) => {
            if (textRef?.current) textRef.current.style.opacity = opacity;
        };
        // Autoplay blocked (Safari "Never Auto-Play") or the file failed:
        // show the finished state — the still, full-brightness text, and
        // Replay, whose click is a real gesture.
        const fallback = () => {
            setDone(true);
            setText('1');
        };
        video.play().catch((e: DOMException) => {
            if (e.name === 'NotAllowedError') fallback();
        });
        video.addEventListener('error', fallback);
        // `playing` fires after Replay's seek to 0 lands, in case `ended` was
        // still true when `play` fired.
        const events = ['play', 'playing', 'pause', 'ended'];
        events.forEach((e) => video.addEventListener(e, sync));
        const updateText = () => {
            if (video.ended) return setText('1');
            const progress = Math.min(video.currentTime / END_CARD, 1);
            setText(String(TEXT_START + (TEXT_PEAK - TEXT_START) * progress));
        };
        updateText();
        const textEvents = ['timeupdate', 'seeked', 'ended'];
        textEvents.forEach((e) => video.addEventListener(e, updateText));
        return () => {
            events.forEach((e) => video.removeEventListener(e, sync));
            textEvents.forEach((e) => video.removeEventListener(e, updateText));
            video.removeEventListener('error', fallback);
            // Phones (no video) keep the text at full brightness.
            setText('');
        };
    }, [desktop, textRef]);

    const toggle = () => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) video.play().catch(() => {});
        else video.pause();
    };

    // play() inside the click keeps the gesture, so an unmuted replay works.
    const replay = () => {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = 0;
        video.play().catch(() => {});
    };

    // Unmute synchronously inside the click, or iOS drops the gesture. A
    // finished video stays finished; Replay restarts it with this setting.
    const toggleSound = () => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        setMuted(video.muted);
        if (!video.muted && video.paused && !done) video.play().catch(() => {});
    };

    return (
        <>
            <Image
                src='/images/hero.png'
                alt='Alpha Kappa Psi Brotherhood'
                fill
                // Slow zoom-out as the video fades away, so the still arrives
                // instead of cutting in. Class-driven so it's already zoomed on
                // first paint instead of zooming in on load.
                className={cn(
                    'object-cover transition-transform duration-[4000ms] ease-out lg:scale-110',
                    done && 'lg:scale-100'
                )}
                priority
            />
            {desktop && (
                <video
                    ref={videoRef}
                    className={cn(
                        'absolute inset-0 h-full w-full object-cover transition-opacity duration-[2500ms] ease-in-out',
                        done && 'pointer-events-none opacity-0'
                    )}
                    src={rushVideo}
                    muted
                    playsInline
                    preload='auto'
                    aria-hidden='true'
                />
            )}
            <div className='absolute inset-0 bg-black/50'></div>
            {desktop && (
                <>
                    {/* A lowkey nudge toward the sound button while it plays muted */}
                    <AnimatePresence>
                        {muted && !done && !paused && (
                            <motion.div
                                key='sound-hint'
                                className='pointer-events-none absolute bottom-8 right-[7.25rem] p-2 text-white/70'
                                aria-hidden='true'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, x: [0, 4, 0] }}
                                exit={{
                                    opacity: 0,
                                    transition: { duration: 0.3 },
                                }}
                                transition={{
                                    opacity: { duration: 0.6, delay: 2 },
                                    x: {
                                        duration: 1.4,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    },
                                }}
                            >
                                <ArrowRight size={18} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button
                        type='button'
                        onClick={toggleSound}
                        className='absolute bottom-8 right-20 rounded bg-black/40 p-2 text-white hover:bg-black/60'
                        aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
                    >
                        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    {done ? (
                        <button
                            type='button'
                            onClick={replay}
                            className='absolute bottom-8 right-8 rounded bg-black/40 p-2 text-white hover:bg-black/60'
                            aria-label='Replay background video'
                        >
                            <RotateCcw size={18} />
                        </button>
                    ) : (
                        <button
                            type='button'
                            onClick={toggle}
                            className='absolute bottom-8 right-8 rounded bg-black/40 p-2 text-white hover:bg-black/60'
                            aria-label={
                                paused
                                    ? 'Play background video'
                                    : 'Pause background video'
                            }
                        >
                            {paused ? <Play size={18} /> : <Pause size={18} />}
                        </button>
                    )}
                </>
            )}
        </>
    );
};
