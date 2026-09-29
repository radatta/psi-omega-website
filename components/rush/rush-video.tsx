'use client';

import { useEffect, useRef, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { rushVideo } from '@/lib/rush_data';

// Autoplays muted once the whole video is on screen, with a "Tap for sound"
// button; pauses when it leaves. A manual pause (or reaching the end) stops
// autoplay until they press play.
export default function RushVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const userPaused = useRef(false);
    const autoPausing = useRef(false);
    const [needsTap, setNeedsTap] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        // React may not emit the muted attribute in server HTML.
        video.muted = true;

        // Always starts muted so autoplay is never blocked; the pill unmutes.
        // Later auto-resumes keep whatever the visitor chose; if the browser
        // refuses an unmuted resume, fall back to muted again.
        const autoplay = async () => {
            try {
                await video.play();
            } catch (e) {
                // AbortError means we paused it mid-load (scrolled away);
                // retrying would leave it playing off screen.
                if ((e as DOMException).name !== 'NotAllowedError') return;
                video.muted = true;
                video.play().catch(() => {});
            }
            if (video.muted) setNeedsTap(true);
        };

        const onPause = () => {
            if (autoPausing.current) autoPausing.current = false;
            else userPaused.current = true;
        };
        // A restart from the native controls after the end comes back muted,
        // so offer the pill again.
        const onPlay = () => {
            userPaused.current = false;
            if (video.muted) setNeedsTap(true);
        };
        const onVolume = () => !video.muted && setNeedsTap(false);
        // A pill over a finished video would restart it on click.
        const onEnded = () => setNeedsTap(false);
        video.addEventListener('pause', onPause);
        video.addEventListener('play', onPlay);
        video.addEventListener('volumechange', onVolume);
        video.addEventListener('ended', onEnded);

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.intersectionRatio >= 0.99) {
                    if (!userPaused.current && video.paused) autoplay();
                } else if (!entry.isIntersecting && !video.paused) {
                    autoPausing.current = true;
                    video.pause();
                }
            },
            { threshold: [0, 0.99] }
        );
        observer.observe(video);
        return () => {
            observer.disconnect();
            video.removeEventListener('pause', onPause);
            video.removeEventListener('play', onPlay);
            video.removeEventListener('volumechange', onVolume);
            video.removeEventListener('ended', onEnded);
        };
    }, []);

    // Must unmute synchronously inside the click, or iOS drops the gesture.
    const unmute = () => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = false;
        video.play().catch(() => {});
        setNeedsTap(false);
    };

    return (
        <div className='relative w-full h-full'>
            <video
                ref={videoRef}
                className='w-full h-full rounded-lg shadow-lg bg-black'
                src={rushVideo}
                aria-label='Alpha Kappa Psi rush video'
                muted
                controls
                playsInline
                preload='metadata'
            />
            {needsTap && (
                <button
                    type='button'
                    onClick={unmute}
                    className='absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur hover:bg-black/85'
                >
                    <Volume2 size={16} />
                    Tap for sound
                </button>
            )}
        </div>
    );
}
