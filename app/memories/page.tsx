'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import { memoriesPhotosPaths } from '@/lib/memories_data';

const BLUR_DATA_URL =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PC9zdmc+';

type Photo = {
    src: string;
    alt: string;
};

export default function PhotoCollagePage() {
    const containerRef = useRef<HTMLElement | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    // Detect mobile device on client side
    useEffect(() => {
        let resizeTimer: NodeJS.Timeout | null = null;

        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        const debouncedResize = () => {
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(checkMobile, 150);
        };

        checkMobile();
        window.addEventListener('resize', debouncedResize);
        return () => {
            window.removeEventListener('resize', debouncedResize);
            if (resizeTimer) clearTimeout(resizeTimer);
        };
    }, []);

    // break into rows of N photos (fewer on mobile)
    const N = isMobile ? 4 : 7;

    // Limit number of images on mobile to improve performance
    const limitedPhotos = isMobile
        ? [...memoriesPhotosPaths].slice(0, 50)
        : [...memoriesPhotosPaths];

    // Shuffle photos before breaking into rows
    const shuffledPhotos = [...limitedPhotos].sort(() => Math.random() - 0.5);

    const createOptimizedRows = (): Photo[][] => {
        // Create base rows first
        const baseRows: Photo[][] = [];
        for (let i = 0; i < Math.ceil(shuffledPhotos.length / N); i++) {
            const startIdx = (i * N) % shuffledPhotos.length;
            const rowPhotos: Photo[] = [];

            // Fill each row with N photos, looping back to start if needed
            for (let j = 0; j < N; j++) {
                const idx = (startIdx + j) % shuffledPhotos.length;
                rowPhotos.push(shuffledPhotos[idx]);
            }

            baseRows.push(rowPhotos);
        }

        // Create enough repetitions for scrolling without excessive DOM nodes
        // Use fewer repetitions on mobile
        const repetitions = isMobile ? 3 : 10;

        return baseRows.map((baseRow) => {
            return Array(repetitions)
                .fill(0)
                .flatMap(() => [...baseRow]);
        });
    };

    const optimizedPhotoRows = createOptimizedRows();

    // Pre-define spring animations for each row - simplified for mobile
    const leftRowX = useSpring(
        useTransform(scrollYProgress, [0, 1], [0, isMobile ? -800 : -1600]),
        {
            stiffness: isMobile ? 50 : 100,
            damping: isMobile ? 15 : 30,
            restDelta: 0.001,
        }
    );
    const rightRowX = useSpring(
        useTransform(scrollYProgress, [0, 1], [0, isMobile ? 800 : 1600]),
        {
            stiffness: isMobile ? 50 : 100,
            damping: isMobile ? 15 : 30,
            restDelta: 0.001,
        }
    );

    // Create variations for different rows with different speeds - simplified for mobile
    const rowAnimations = [
        useSpring(
            useTransform(scrollYProgress, [0, 1], [0, isMobile ? -600 : -1200]),
            {
                stiffness: isMobile ? 45 : 90,
                damping: isMobile ? 15 : 35,
                restDelta: 0.001,
            }
        ),
        useSpring(
            useTransform(scrollYProgress, [0, 1], [0, isMobile ? 900 : 1800]),
            {
                stiffness: isMobile ? 40 : 85,
                damping: isMobile ? 12 : 25,
                restDelta: 0.001,
            }
        ),
        useSpring(
            useTransform(scrollYProgress, [0, 1], [0, isMobile ? -700 : -1400]),
            {
                stiffness: isMobile ? 55 : 110,
                damping: isMobile ? 20 : 40,
                restDelta: 0.001,
            }
        ),
        useSpring(
            useTransform(scrollYProgress, [0, 1], [0, isMobile ? 850 : 1700]),
            {
                stiffness: isMobile ? 48 : 95,
                damping: isMobile ? 15 : 30,
                restDelta: 0.001,
            }
        ),
        useSpring(
            useTransform(scrollYProgress, [0, 1], [0, isMobile ? -650 : -1300]),
            {
                stiffness: isMobile ? 52 : 105,
                damping: isMobile ? 22 : 45,
                restDelta: 0.001,
            }
        ),
    ];

    // Opacity transforms
    const opacity1 = useTransform(
        scrollYProgress,
        [0, 0.2, 0.8, 1],
        [0, 1, 1, 0]
    );

    return (
        <main
            ref={containerRef}
            className='min-h-[500vh] bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden'
        >
            {/* Hero Section */}
            <section className='relative h-screen flex items-center justify-center'>
                <div className='absolute inset-0 z-0'>
                    <Image
                        src='/images/memory-hero.jpg'
                        alt='AKPsi Memories'
                        fill
                        className='object-cover opacity-40'
                        priority
                    />
                </div>

                <motion.div
                    className='container mx-auto px-4 z-10 text-center text-white'
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                >
                    <motion.h1
                        className='text-6xl md:text-8xl font-bold mb-6'
                        animate={{
                            textShadow: [
                                '0 0 20px rgba(255,255,255,0.5)',
                                '0 0 40px rgba(255,255,255,0.8)',
                                '0 0 20px rgba(255,255,255,0.5)',
                            ],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        MEMORIES
                    </motion.h1>
                    <p className='text-xl md:text-2xl max-w-3xl mx-auto opacity-90'>
                        Scroll to experience our journey
                    </p>
                </motion.div>
            </section>

            {/* Horizontal Sliding Photos Section */}
            <section className='relative min-h-screen flex flex-col justify-evenly overflow-hidden py-20 perspective-[1000px]'>
                <div className='absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20' />

                {optimizedPhotoRows.map((row, rowIndex) => (
                    <motion.div
                        key={rowIndex}
                        className={`relative flex space-x-8 my-6 ${rowIndex % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                        style={{
                            x:
                                rowIndex < rowAnimations.length
                                    ? rowAnimations[rowIndex]
                                    : rowIndex % 2 === 0
                                      ? leftRowX
                                      : rightRowX,
                        }}
                    >
                        {row.map((photo, photoIndex) => (
                            <motion.div
                                key={photoIndex}
                                className={`relative ${
                                    rowIndex % 3 === 0
                                        ? 'w-60 h-48 md:w-80 md:h-60 rounded-2xl'
                                        : rowIndex % 3 === 1
                                          ? 'w-56 h-56 md:w-72 md:h-72 rounded-full'
                                          : 'w-48 h-40 md:w-64 md:h-48 rounded-xl'
                                } overflow-hidden shadow-2xl flex-shrink-0 transition-all duration-300`}
                                whileHover={
                                    isMobile
                                        ? {}
                                        : {
                                              scale: 1.1,
                                              zIndex: 10,
                                              boxShadow:
                                                  '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
                                              filter: 'brightness(1.1)',
                                          }
                                }
                                style={{
                                    rotate: isMobile
                                        ? 0
                                        : rowIndex % 2 === 0
                                          ? Math.sin(photoIndex) * 5
                                          : Math.cos(photoIndex) * 8,
                                }}
                            >
                                <Image
                                    src={photo.src || '/placeholder.svg'}
                                    alt={photo.alt}
                                    fill
                                    className='object-cover'
                                    sizes={
                                        isMobile
                                            ? '(max-width: 768px) 100vw, 33vw'
                                            : '(max-width: 1200px) 50vw, 33vw'
                                    }
                                    quality={isMobile ? 60 : 80}
                                    loading='lazy'
                                    placeholder='blur'
                                    blurDataURL={BLUR_DATA_URL}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                ))}

                {/* Center text */}
                <motion.div
                    className='absolute inset-0 flex items-start justify-center z-20 pt-[150vh]'
                    style={{ opacity: opacity1 }}
                >
                    <div className='text-center text-white'>
                        <h2 className='text-5xl md:text-7xl font-bold mb-4'>
                            BROTHERHOOD
                        </h2>
                        <p className='text-5xl opacity-80'>
                            BONDS THAT LAST FOREVER
                        </p>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}
