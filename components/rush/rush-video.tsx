'use client';

import { useEffect, useRef } from 'react';

// Autoplays once the whole video is on screen; pauses when it leaves.
// A manual pause sticks until the viewer presses play again.
export default function RushVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const userPaused = useRef(false);
    const autoPausing = useRef(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const onPause = () => {
            if (autoPausing.current) autoPausing.current = false;
            else userPaused.current = true;
        };
        const onPlay = () => (userPaused.current = false);
        video.addEventListener('pause', onPause);
        video.addEventListener('play', onPlay);

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.intersectionRatio >= 0.99) {
                    if (!userPaused.current) video.play().catch(() => {});
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
        };
    }, []);

    return (
        <video
            ref={videoRef}
            className='w-full h-full rounded-lg shadow-lg bg-black'
            src='/videos/rush.mp4'
            aria-label='Alpha Kappa Psi rush video'
            muted
            controls
            loop
            playsInline
            preload='metadata'
        />
    );
}
