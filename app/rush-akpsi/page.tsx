'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import RushFAQ from '@/components/rush/rush-faq';
import { motion } from 'motion/react';
import { currentRushData } from '@/lib/rush_data';

export default function RushPage() {
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
                        src='/images/rush/rush-hero.jpg'
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
                        className='text-4xl md:text-6xl font-bold mb-4'
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        RUSH ALPHA KAPPA PSI
                    </motion.h1>
                    <motion.p
                        className='text-xl md:text-2xl'
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.1 }}
                    >
                        See yourself here? Take the first step toward your goals
                        and come out to rush!
                    </motion.p>
                    <motion.div
                        className='mt-8'
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.4 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            asChild
                            size='lg'
                            variant='outline'
                            className='bg-transparent text-white border-white hover:bg-white/20 transition-all duration-300'
                        >
                            <a href='#rush-info'>Learn More</a>
                        </Button>
                    </motion.div>
                </motion.div>

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
            </section>

            <div className='relative z-10 bg-white'>
                {/* Rush Info Section */}
                <section id='rush-info' className='py-16 bg-white'>
                    <div className='container'>
                        <motion.div
                            className='text-center mb-8'
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true, margin: '100px' }}
                        >
                            <motion.h1
                                className='text-3xl md:text-4xl font-bold mb-4'
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                {currentRushData.rushName}
                            </motion.h1>
                            <motion.h2
                                className='text-xl md:text-2xl mb-2'
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                viewport={{ once: true }}
                            >
                                {currentRushData.rushDate}
                            </motion.h2>
                            <motion.h2
                                className='text-xl md:text-2xl mb-8'
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                viewport={{ once: true }}
                            >
                                {currentRushData.rushWeek}
                            </motion.h2>
                        </motion.div>

                        <motion.div
                            className='max-w-4xl mx-auto mb-8'
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className='relative aspect-[16/10] w-full'>
                                <Image
                                    src={currentRushData.rushFlyer}
                                    alt={currentRushData.rushName + ' Flyer'}
                                    fill
                                    className='object-contain rounded-lg'
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            className='text-center mb-8'
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Link
                                    href={currentRushData.rushMailingList}
                                    target='_blank'
                                    className='text-blue-600 hover:underline font-bold transition-colors duration-300'
                                >
                                    Join our Rush Mailing List!
                                </Link>
                            </motion.div>
                        </motion.div>

                        {currentRushData.rushApplication.link ? (
                            <motion.div
                                className='flex justify-center mb-12'
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button asChild size='lg'>
                                    <Link
                                        href={
                                            currentRushData.rushApplication.link
                                        }
                                        target='_blank'
                                    >
                                        Application Due{' '}
                                        {
                                            currentRushData.rushApplication
                                                .dueDate
                                        }
                                    </Link>
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                className='flex justify-center mb-12'
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <p className='text-xl font-semibold'>
                                    Application will be next week!
                                </p>
                            </motion.div>
                        )}

                        <motion.hr
                            className='border-gray-300 mb-12'
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        />

                        <motion.div
                            className='max-w-4xl mx-auto'
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <motion.h3
                                className='text-xl font-semibold mb-4 text-center'
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                Press play to see what Alpha Kappa Psi is all
                                about!
                            </motion.h3>
                            <motion.div
                                className='aspect-video w-full'
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <iframe
                                    className='w-full h-full rounded-lg shadow-lg'
                                    src='https://www.youtube.com/embed/deYrnHClMUM'
                                    title='Alpha Kappa Psi Rush Video'
                                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                                    allowFullScreen
                                ></iframe>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id='faq' className='py-16 bg-gray-50'>
                    <div className='container'>
                        <motion.h1
                            className='text-3xl md:text-4xl font-bold text-center mb-4'
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true, margin: '100px' }}
                        >
                            Frequently Asked Questions
                        </motion.h1>
                        <motion.hr
                            className='border-gray-300 w-24 mx-auto mb-12'
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        />

                        <motion.div
                            className='max-w-4xl mx-auto'
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <RushFAQ />
                        </motion.div>
                    </div>
                </section>

                {/* Contact Section */}
                <section
                    id='contact'
                    className='relative h-screen flex items-center justify-center text-white overflow-hidden'
                >
                    <motion.div
                        className='absolute inset-0 z-0'
                        initial={{ scale: 1.1 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 1.5 }}
                        viewport={{ once: true }}
                    >
                        <Image
                            src='/images/rush/contact-us.jpg'
                            alt='Contact Background'
                            fill
                            className='object-cover'
                        />
                        <div className='absolute inset-0 bg-black/60'></div>
                    </motion.div>
                    <motion.div
                        className='container relative z-10 text-center'
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true, margin: '100px' }}
                    >
                        <motion.h1
                            className='text-3xl md:text-5xl font-bold mb-4'
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            Contact Us
                        </motion.h1>
                        <motion.p
                            className='text-xl mb-8'
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            For questions or concerns regarding Rush, please
                            email <strong>akpsi@scu.edu</strong>.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                asChild
                                size='lg'
                                className='bg-white text-black hover:bg-gray-200 transition-all duration-300'
                            >
                                <a href='mailto:akpsi@scu.edu'>
                                    <Mail className='mr-2 h-4 w-4' /> ASK ABOUT
                                    RUSH
                                </a>
                            </Button>
                        </motion.div>
                    </motion.div>
                </section>
            </div>
        </main>
    );
}
