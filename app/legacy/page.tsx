'use client';
import Image from 'next/image';
import { companies } from '@/lib/legacy_data';
import { motion } from 'motion/react';

export default function LegacyPage() {
    return (
        <main className='min-h-screen pb-16'>
            {/* Network Section */}
            <section
                id='network'
                className='relative h-screen flex items-center justify-center text-white overflow-hidden'
            >
                <motion.div
                    className='absolute inset-0 z-0'
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                >
                    <Image
                        src='/images/legacy-hero.jpg'
                        alt='AKPsi Network'
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
                        className='text-4xl md:text-6xl font-bold mb-4'
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        OUR NETWORK
                    </motion.h1>
                    <motion.p
                        className='text-xl max-w-3xl mx-auto'
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.1 }}
                    >
                        From internships to full-time offers, our brothers have
                        secured positions spanning a variety of industries.
                        Check out this list to see some employers of our
                        brothers!
                    </motion.p>
                </motion.div>
            </section>

            {/* Companies Section */}
            <section id='companies' className='py-16 bg-white'>
                <div className='container'>
                    <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8'>
                        {companies.map((company, index) => (
                            <motion.div
                                key={index}
                                className='flex items-center justify-center p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow'
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.05,
                                }}
                                viewport={{ once: true, margin: '100px' }}
                                whileHover={{ scale: 1.1, rotate: 2 }}
                            >
                                <div className='flex items-center justify-center aspect-square w-24 h-24'>
                                    <Image
                                        src={`/images/companies/${company.logo}`}
                                        alt={company.name}
                                        width={96}
                                        height={96}
                                        className='object-contain w-full h-full'
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
