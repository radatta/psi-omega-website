'use client';

import { useEffect, useRef } from 'react';

// Autoplays once the whole video is on screen; pauses when it leaves.
export default function RushVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.intersectionRatio >= 0.99)
                    video.play().catch(() => {});
                else if (!entry.isIntersecting) video.pause();
            },
            { threshold: [0, 0.99] }
        );
        observer.observe(video);
        return () => observer.disconnect();
    }, []);

    return (
        <video
            ref={videoRef}
            className='w-full h-full rounded-lg shadow-lg bg-black'
            src='/videos/rush.mp4'
            title='Alpha Kappa Psi Rush Video'
            muted
            controls
            loop
            playsInline
            preload='metadata'
        />
    );
}
