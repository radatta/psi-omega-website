'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import { pastPhotos } from '@/lib/memories_data';

export default function PhotoCollagePage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    // break into rows of N photos
    const N = 7;
    // Shuffle photos before breaking into rows
    const shuffledPhotos = [...pastPhotos].sort(() => Math.random() - 0.5);

    // // Create circular rows by duplicating photos to ensure smooth looping
    // const createCircularRow = (photos: typeof pastPhotos, rowSize: number) => {
    //     // Duplicate the array to create a circular effect
    //     const duplicated = [...photos, ...photos.slice(0, rowSize)];
    //     return Array.from(
    //         { length: Math.ceil(photos.length / rowSize) },
    //         (_, i) => duplicated.slice(i * rowSize, (i + 1) * rowSize)
    //     );
    // };

    // const photoRows = createCircularRow(shuffledPhotos, N);

    const createInfiniteScrollRows = () => {
        // Create base rows first
        const baseRows = [];
        for (let i = 0; i < Math.ceil(shuffledPhotos.length / N); i++) {
            const startIdx = (i * N) % shuffledPhotos.length;
            const rowPhotos = [];

            // Fill each row with N photos, looping back to start if needed
            for (let j = 0; j < N; j++) {
                const idx = (startIdx + j) % shuffledPhotos.length;
                rowPhotos.push(shuffledPhotos[idx]);
            }

            baseRows.push(rowPhotos);
        }

        // Now create the actual rows with many repetitions
        return baseRows.map((baseRow) => {
            // Create an array with 100 copies of the base row flattened into a single array
            // This ensures each row has enough photos to scroll for a very long time
            return Array(100)
                .fill(0)
                .flatMap(() => [...baseRow]);
        });
    };

    const infinitePhotoRows = createInfiniteScrollRows();

    // Pre-define spring animations for each row
    const leftRowX = useSpring(
        useTransform(scrollYProgress, [0, 1], [0, -1600]),
        {
            stiffness: 100,
            damping: 30,
            restDelta: 0.001,
        }
    );
    const rightRowX = useSpring(
        useTransform(scrollYProgress, [0, 1], [0, 1600]),
        {
            stiffness: 100,
            damping: 30,
            restDelta: 0.001,
        }
    );

    // Create variations for different rows with different speeds
    const rowAnimations = [
        useSpring(useTransform(scrollYProgress, [0, 1], [0, -1200]), {
            stiffness: 90,
            damping: 35,
            restDelta: 0.001,
        }),
        useSpring(useTransform(scrollYProgress, [0, 1], [0, 1800]), {
            stiffness: 85,
            damping: 25,
            restDelta: 0.001,
        }),
        useSpring(useTransform(scrollYProgress, [0, 1], [0, -1400]), {
            stiffness: 110,
            damping: 40,
            restDelta: 0.001,
        }),
        useSpring(useTransform(scrollYProgress, [0, 1], [0, 1700]), {
            stiffness: 95,
            damping: 30,
            restDelta: 0.001,
        }),
        useSpring(useTransform(scrollYProgress, [0, 1], [0, -1300]), {
            stiffness: 105,
            damping: 45,
            restDelta: 0.001,
        }),
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

                {infinitePhotoRows.map((row, rowIndex) => (
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
                                        ? 'w-80 h-60 rounded-2xl'
                                        : rowIndex % 3 === 1
                                          ? 'w-72 h-72 rounded-full'
                                          : 'w-64 h-48 rounded-xl'
                                } overflow-hidden shadow-2xl flex-shrink-0 transition-all duration-300`}
                                whileHover={{
                                    scale: 1.1,
                                    zIndex: 10,
                                    boxShadow:
                                        '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
                                    filter: 'brightness(1.1)',
                                }}
                                style={{
                                    rotate:
                                        rowIndex % 2 === 0
                                            ? Math.sin(photoIndex) * 5
                                            : Math.cos(photoIndex) * 8,
                                }}
                            >
                                <Image
                                    src={photo.src || '/placeholder.svg'}
                                    alt={photo.alt}
                                    fill
                                    className='object-cover'
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                ))}

                {/* Center text */}
                <motion.div
                    className='absolute inset-0 flex items-center justify-center z-20'
                    style={{ opacity: opacity1 }}
                >
                    <div className='text-center text-white'>
                        <h2 className='text-5xl md:text-7xl font-bold mb-4'>
                            BROTHERHOOD
                        </h2>
                        <p className='text-xl opacity-80'>
                            Bonds that last forever
                        </p>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}
