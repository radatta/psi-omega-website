'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function AnimatedOverlaySection() {
    const involvementRef = useRef<HTMLDivElement>(null);
    const [overlayOpacity, setOverlayOpacity] = useState(0.4);

    useEffect(() => {
        function handleScroll() {
            if (!involvementRef.current) return;
            const rect = involvementRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Calculate progress: 0 when section just enters, 1 when top reaches top of viewport
            let progress = 1 - rect.top / windowHeight;
            progress = Math.max(0, Math.min(1, progress));

            // Opacity: 0.95 (black) to 0 (transparent)
            setOverlayOpacity(0.2 + 0.95 * (1 - progress));
        }
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section
            id='involvement'
            className='relative h-screen flex items-center justify-center text-white'
            ref={involvementRef}
        >
            <div className='absolute inset-0 z-0'>
                <Image
                    src='/images/legacy-campus-involvement.jpg'
                    alt='Santa Clara University Campus'
                    fill
                    className='object-cover'
                />
                <div
                    className='absolute inset-0'
                    style={{
                        backgroundColor: `rgba(0,0,0,${overlayOpacity})`,
                        transition: 'background-color 0.2s',
                    }}
                ></div>
            </div>
            <div className='container relative z-10 text-center'>
                <h1 className='text-4xl md:text-6xl font-bold mb-4'>
                    CAMPUS INVOLVEMENT
                </h1>
                <p className='text-xl max-w-3xl mx-auto mb-4'>
                    Not only are AKPsi brothers actively involved in
                    professional development, but also in personal growth and
                    knowledge. Outside of our organization, many of our brothers
                    hold leadership positions and make important contributions
                    to cultural, academic, and/or personal clubs. All of our
                    skills and experiences bring together an extensive amount of
                    knowledge and diversity that makes AKPsi so special.
                </p>
                <p className='text-xl max-w-3xl mx-auto'>
                    Take a look below at some of the organizations our brothers
                    are involved in!
                </p>
            </div>
        </section>
    );
}
