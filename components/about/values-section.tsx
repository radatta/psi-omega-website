'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ValuesSection() {
    return (
        <section id='values' className='py-16 bg-white'>
            <div className='container'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <div>
                        <h1 className='text-4xl md:text-5xl font-bold mb-8'>
                            OUR VALUES
                        </h1>
                        <hr className='border-gray-300 mb-8' />
                    </div>
                    <div className='md:col-span-1'></div>
                </div>

                <div className='mt-8 w-full flex justify-center'>
                    <motion.div
                        className='relative h-32 md:h-64 w-full max-w-5xl'
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        viewport={{ once: true }}
                    >
                        <Image
                            src='/images/values-icons.jpg'
                            alt='Alpha Kappa Psi Values'
                            fill
                            className='object-contain'
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
