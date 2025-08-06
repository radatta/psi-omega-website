'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMobile } from '@/hooks/use-mobile';

const valueImages = [
    {
        src: '/images/values/Brotherhood.png',
        alt: 'Brotherhood',
    },
    { src: '/images/values/Knowledge.png', alt: 'Knowledge' },
    { src: '/images/values/Integrity.png', alt: 'Integrity' },
    { src: '/images/values/Service.png', alt: 'Service' },
    { src: '/images/values/Unity.png', alt: 'Unity' },
];

export default function ValuesSection() {
    const isMobile = useMobile();
    return (
        <section
            id='values'
            className='py-16 bg-white relative overflow-hidden'
        >
            <motion.div
                className='absolute inset-0 z-0'
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.5 }}
                viewport={{ once: true, margin: '100px' }}
            ></motion.div>

            <div className='container relative z-10'>
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
                        className='relative w-full max-w-5xl'
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        viewport={{ once: true }}
                    >
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true, margin: '100px' }}
                        >
                            <div className='grid grid-cols-2 md:grid-cols-5 gap-16 md:gap-4 justify-items-center'>
                                {valueImages.map((image, index) => (
                                    <motion.div
                                        key={index}
                                        className='mb-4'
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.6,
                                            delay: index * 0.1,
                                        }}
                                        viewport={{
                                            once: true,
                                            margin: '-50px',
                                        }}
                                        style={
                                            isMobile &&
                                            valueImages.length % 2 === 1 &&
                                            index === valueImages.length - 1
                                                ? { gridColumn: 'span 2' }
                                                : {}
                                        }
                                    >
                                        <motion.div
                                            className='relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 h-42 w-42'
                                            whileHover={{
                                                scale: 1.05,
                                                rotate: 1,
                                            }}
                                        >
                                            <Image
                                                src={
                                                    image.src ||
                                                    '/placeholder.svg'
                                                }
                                                alt={image.alt}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
