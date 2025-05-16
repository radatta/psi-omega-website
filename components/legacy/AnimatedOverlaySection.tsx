'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { campusOrganizations } from '@/lib/legacy_data';

export default function AnimatedOverlaySection() {
    const involvementRef = useRef<HTMLDivElement>(null);
    const [overlayOpacity, setOverlayOpacity] = useState(0.4);
    const [parallaxY, setParallaxY] = useState(0);

    useEffect(() => {
        function handleScroll() {
            if (!involvementRef.current) return;
            const rect = involvementRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const sectionHeight = involvementRef.current.offsetHeight;

            // Calculate scroll progress through the section (0 at top, 1 at bottom)
            const scrollY = Math.min(
                Math.max(-rect.top, 0),
                sectionHeight - windowHeight
            );
            const progress = scrollY / (sectionHeight - windowHeight);

            // Parallax: move content at 30% of scroll speed
            setParallaxY(scrollY * 0.3);

            // Overlay fade: gradual, eased interpolation
            setOverlayOpacity(0.5 - 0.3 * Math.pow(progress, 0.85));
        }
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section
            id='involvement'
            className='relative h-[270vh] md:h-[250vh] text-white mb-[43vh] md:mb-[35vh]'
            ref={involvementRef}
        >
            <div
                className='absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none'
                style={{
                    transform: `translateY(${parallaxY}px)`,
                    willChange: 'transform',
                }}
            >
                <div className='absolute inset-0 z-0'>
                    <Image
                        src='/images/campus-involvement.png'
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
                        professional development, but also in personal growth
                        and knowledge. Outside of our organization, many of our
                        brothers hold leadership positions and make important
                        contributions to cultural, academic, and/or personal
                        clubs. All of our skills and experiences bring together
                        an extensive amount of knowledge and diversity that
                        makes AKPsi so special.
                    </p>
                    <p className='text-xl max-w-3xl mx-auto'>
                        Take a look below at some of the organizations our
                        brothers are involved in!
                    </p>

                    {/* Campus Organizations Section */}
                    <section
                        id='campus-involvement'
                        className='py-16 z-10 relative text-white font-semibold'
                    >
                        <div className='container'>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                                {/* Column 1 */}
                                <div>
                                    {campusOrganizations
                                        .slice(
                                            0,
                                            Math.ceil(
                                                campusOrganizations.length / 3
                                            )
                                        )
                                        .map((org, index) => (
                                            <p
                                                key={index}
                                                className='text-center mb-3'
                                            >
                                                {org}
                                            </p>
                                        ))}
                                </div>

                                {/* Column 2 */}
                                <div>
                                    {campusOrganizations
                                        .slice(
                                            Math.ceil(
                                                campusOrganizations.length / 3
                                            ),
                                            Math.ceil(
                                                campusOrganizations.length / 3
                                            ) * 2
                                        )
                                        .map((org, index) => (
                                            <p
                                                key={index}
                                                className='text-center mb-3'
                                            >
                                                {org}
                                            </p>
                                        ))}
                                </div>

                                {/* Column 3 */}
                                <div>
                                    {campusOrganizations
                                        .slice(
                                            Math.ceil(
                                                campusOrganizations.length / 3
                                            ) * 2
                                        )
                                        .map((org, index) => (
                                            <p
                                                key={index}
                                                className='text-center mb-3'
                                            >
                                                {org}
                                            </p>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </section>
    );
}
