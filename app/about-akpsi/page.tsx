'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ValuesSection from '@/components/about/values-section';
import StatisticsSection from '@/components/about/statistics-section';
import HistorySection from '@/components/about/history-section';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';

// export const metadata = {
//     title: 'About AKPsi - Psi Omega Chapter',
//     description:
//         'Learn about the Psi Omega Chapter of Alpha Kappa Psi at Santa Clara University. Discover our history, values, and commitment to professional development and community service.',
// };
// put everything in a page and then metadata that

export default function AboutPage() {
    return (
        <main className='min-h-screen'>
            {/* Hero Section */}
            <section
                id='psi-omega-chapter'
                className='relative h-screen flex items-center justify-center text-white overflow-hidden'
            >
                <motion.div
                    className='absolute inset-0 z-0'
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                >
                    <Image
                        src='/images/about-hero.png'
                        alt='Psi Omega Chapter'
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
                        PSI OMEGA CHAPTER
                    </motion.h1>
                    <motion.p
                        className='text-xl md:text-2xl'
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.1 }}
                    >
                        Brotherhood · Knowledge · Integrity · Service · Unity
                    </motion.p>
                </motion.div>
            </section>

            {/* Statistics Section */}
            <StatisticsSection />

            {/* Values Section */}
            <ValuesSection />

            {/* History Section */}
            <HistorySection />

            {/* Contact Section */}
            <section
                id='question'
                className='relative h-screen flex items-center justify-center py-20 text-white overflow-hidden'
            >
                <motion.div
                    className='absolute inset-0 z-0'
                    initial={{ scale: 1.1 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                    viewport={{ once: true, margin: '100px' }}
                >
                    <Image
                        src='/images/Got-A-Question.jpg'
                        alt='Contact Background'
                        fill
                        className='object-fill'
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
                        QUESTIONS?
                    </motion.h1>
                    <motion.p
                        className='text-xl mb-8'
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        For any general questions, please email{' '}
                        <strong>akpsi@scu.edu</strong>
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
                                <EnvelopeClosedIcon className='mr-2 h-4 w-4' />{' '}
                                EMAIL US
                            </a>
                        </Button>
                    </motion.div>
                </motion.div>
            </section>
        </main>
    );
}
