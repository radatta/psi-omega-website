import Image from 'next/image';
import Database from '@/components/database/Database';
import { motion } from 'motion/react';
export default function DatabasePage() {
    return (
        <main className='min-h-screen'>
            {/* Hero Section */}
            <section
                id='our-database'
                className='relative h-screen flex items-center justify-center text-white overflow-hidden'
            >
                <motion.div
                    className='absolute inset-0 z-0'
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                >
                    <Image
                        src='/images/database-hero.jpg'
                        alt='AKPsi Database'
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
                        OUR DATABASE
                    </motion.h1>
                    <motion.p
                        className='text-xl max-w-3xl mx-auto'
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.1 }}
                    >
                        Connect with professionals across all industries!
                    </motion.p>
                </motion.div>
            </section>

            {/* Database Section */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: '-100px' }}
            >
                <Database />
            </motion.div>
        </main>
    );
}
