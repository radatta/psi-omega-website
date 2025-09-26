'use client';
import { BrotherCard } from '@/components/brothers/BrotherCard';
import {
    executiveCommittee,
    committeeChairs,
    alphaNu,
    alphaXi,
    alphaOmicron,
    alphaPi,
    alphaRho,
    alphaSigma,
} from '@/lib/brothers_data';
import Image from 'next/image';
import { motion } from 'motion/react';

export default function MeetTheBrotherhood() {
    return (
        <main className='min-h-screen'>
            {/* Hero Section */}
            <section
                id='rush-hero'
                className='relative h-screen flex items-center justify-center text-white overflow-hidden'
            >
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className='absolute inset-0'
                >
                    <Image
                        src='/images/brothers-hero.jpg'
                        alt='Rush Alpha Kappa Psi'
                        fill
                        className='object-cover'
                        priority
                    />
                    <div className='absolute inset-0 bg-black/50'></div>
                </motion.div>

                <motion.div
                    className='container z-10 text-center'
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <motion.h1
                        className='text-4xl md:text-7xl font-bold mb-4'
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        MEET OUR BROTHERS
                    </motion.h1>
                    <motion.p
                        className='text-lg max-w-3xl mx-auto'
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.1 }}
                    >
                        &quot;If you want to go fast, go alone. If you want to
                        go far, go together.&quot;
                    </motion.p>

                    {/* Scroll indicator */}
                    <motion.div
                        className='absolute bottom-8 left-1/2 transform -translate-x-1/2'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 2 }}
                    >
                        <motion.svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            className='text-white'
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <path d='M12 5v14M5 12l7 7 7-7' />
                        </motion.svg>
                    </motion.div>
                </motion.div>
            </section>

            {/* Executive Committee Section */}
            <section className='py-16 bg-white'>
                <div className='container'>
                    <motion.h2
                        className='text-5xl font-bold text-center mb-12'
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, margin: '100px' }}
                    >
                        EXECUTIVE COMMITTEE
                    </motion.h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {executiveCommittee.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true, margin: '200px' }}
                            >
                                <BrotherCard {...member} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Committee Chairs Section */}
            <section className='py-16'>
                <div className='container'>
                    <motion.h2
                        className='text-4xl font-bold text-center mb-12'
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, margin: '100px' }}
                    >
                        COMMITTEE CHAIRS
                    </motion.h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {committeeChairs.map((member, index) => (
                            <motion.div
                                key={index}
                                className='flex flex-col items-center'
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true, margin: '200px' }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <p className='text-center text-xl font-bold '>
                                    {member.position}
                                </p>
                                <h3 className='text-center text-gray-700'>
                                    {member.name}
                                </h3>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Alpha Nu | Fall 2022 */}
            <section className='py-16 bg-white'>
                <div className='container'>
                    <motion.h2
                        className='text-4xl font-bold text-center mb-12'
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, margin: '100px' }}
                    >
                        ALPHA NU | FALL 2022
                    </motion.h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {alphaNu.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true, margin: '200px' }}
                            >
                                <BrotherCard {...member} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Alpha Xi | Winter 2023 */}
            <section className='py-16 bg-gray-50'>
                <div className='container'>
                    <motion.h2
                        className='text-4xl font-bold text-center mb-12'
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, margin: '100px' }}
                    >
                        ALPHA XI | WINTER 2023
                    </motion.h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {alphaXi.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true, margin: '200px' }}
                            >
                                <BrotherCard {...member} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Alpha Omicron | Fall 2023 */}
            <section className='py-16 bg-white'>
                <div className='container'>
                    <motion.h2
                        className='text-4xl font-bold text-center mb-12'
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, margin: '100px' }}
                    >
                        ALPHA OMICRON | FALL 2023
                    </motion.h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {alphaOmicron.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true, margin: '200px' }}
                            >
                                <BrotherCard {...member} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Alpha Pi | Winter 2024 */}
            <section className='py-16 bg-gray-50'>
                <div className='container'>
                    <motion.h2
                        className='text-4xl font-bold text-center mb-12'
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, margin: '100px' }}
                    >
                        ALPHA PI | WINTER 2024
                    </motion.h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {alphaPi.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true, margin: '200px' }}
                            >
                                <BrotherCard {...member} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Alpha Rho | Fall 2024 */}
            <section className='py-16 bg-white'>
                <div className='container'>
                    <motion.h2
                        className='text-4xl font-bold text-center mb-12'
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, margin: '100px' }}
                    >
                        ALPHA RHO | FALL 2024
                    </motion.h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {alphaRho.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true, margin: '200px' }}
                            >
                                <BrotherCard {...member} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Alpha Sigma | Winter 2025 */}
            <section className='py-16 bg-white'>
                <div className='container'>
                    <motion.h2
                        className='text-4xl font-bold text-center mb-12'
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, margin: '100px' }}
                    >
                        ALPHA SIGMA | WINTER 2025
                    </motion.h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {alphaSigma.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true, margin: '200px' }}
                            >
                                <BrotherCard {...member} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
