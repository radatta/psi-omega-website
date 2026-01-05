'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { motion } from 'motion/react';
import { TypewriterEffect } from '@/components/home/typewriter-effect';

export default function Home() {
    const taglineWords = [
        { text: 'SHAPING' },
        { text: 'PEOPLE,', pauseAfter: 1000 },
        { text: 'SHAPING' },
        { text: 'BUSINESS' },
    ];
    return (
        <main className='min-h-screen'>
            {/* Hero Section */}
            <section
                id='hero'
                className='relative h-screen flex items-center justify-center text-white overflow-hidden'
            >
                <motion.div
                    className='absolute inset-0 z-0'
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                >
                    <Link href='/'>
                        <Image
                            src='/images/hero.png'
                            alt='Alpha Kappa Psi Brotherhood'
                            fill
                            className='object-cover'
                            priority
                        />
                    </Link>
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
                        <TypewriterEffect
                            words={taglineWords}
                            className='text-4xl md:text-6xl font-bold mb-4'
                            cursorClassName='bg-white h-8 md:h-12'
                            delay={2000}
                        />
                    </motion.h1>
                    <motion.h3
                        className='text-xl md:text-2xl mb-8'
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.1 }}
                    >
                        Alpha Kappa Psi is recognized as the premier developer
                        of principled business leaders.
                    </motion.h3>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.4 }}
                    >
                        <Button asChild variant={'link'} size={'lg'}>
                            <Link href='/about-akpsi'>LEARN MORE</Link>
                        </Button>
                    </motion.div>
                </motion.div>
                <motion.div
                    className='absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 2 }}
                >
                    <div className='text-sm mb-2'>Scroll</div>
                    <ChevronDownIcon className='mx-auto animate-bounce' />
                </motion.div>
            </section>

            {/* President Letter Section */}
            <section id='letter-president' className='py-16 bg-white'>
                <div className='container'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                        <motion.div
                            className='flex justify-center'
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true, margin: '100px' }}
                        >
                            <motion.div
                                className='relative w-full max-w-md aspect-square'
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Image
                                    src='/images/brothers/Fiona-Holdaway.jpg'
                                    alt='Chapter President'
                                    fill
                                    className='object-cover rounded-md'
                                />
                            </motion.div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true, margin: '100px' }}
                        >
                            <motion.h1
                                className='text-3xl md:text-4xl font-bold mb-4'
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                viewport={{ once: true }}
                            >
                                A LETTER FROM OUR PRESIDENT
                            </motion.h1>
                            <motion.div
                                className='font-light'
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <motion.p
                                    className='mb-4'
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.8 }}
                                    viewport={{ once: true }}
                                >
                                    On behalf of our chapter, I&apos;d like to
                                    welcome you to our official website. This
                                    platform offers a glimpse into who we are:
                                    our values, goals, and the community
                                    we&apos;ve built. Here, you&apos;ll find
                                    information about our chapter&apos;s
                                    mission, our far-reaching professional
                                    network, and the dynamic individuals who
                                    make up our brotherhood.
                                </motion.p>
                                <motion.p
                                    className='mb-4'
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 1.0 }}
                                    viewport={{ once: true }}
                                >
                                    Alpha Kappa Psi is more than just a
                                    professional fraternity. We are a diverse
                                    and driven group of students who share a
                                    passion for leadership, growth, and
                                    excellence. At the Psi Omega chapter, every
                                    member brings a unique perspective and skill
                                    set, creating a collaborative environment
                                    where we challenge and uplift one another in
                                    both professional and personal pursuits.
                                </motion.p>
                                <motion.p
                                    className='mb-4'
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 1.2 }}
                                    viewport={{ once: true }}
                                >
                                    I joined Alpha Kappa Psi during my freshman
                                    year at SCU, and it has been one of the most
                                    impactful experiences of my college journey.
                                    Through this fraternity, I&apos;ve built
                                    lifelong friendships and found a support
                                    system that has shaped who I am today. The
                                    last three years have been transformative,
                                    and I am incredibly honored to lead this
                                    inspiring and dedicated chapter in the
                                    upcoming academic year.
                                </motion.p>
                                <motion.p
                                    className='mb-4'
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 1.4 }}
                                    viewport={{ once: true }}
                                >
                                    Alpha Kappa Psi has given me so much, and
                                    I&apos;m excited to give back to the
                                    organization and the people who have made it
                                    feel like home.
                                </motion.p>
                                <motion.div
                                    className='text-right'
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 1.6 }}
                                    viewport={{ once: true }}
                                >
                                    <p>Best,</p>
                                    <p>Fiona Holdaway </p>
                                    <p className='italic'>
                                        President, Psi Omega Chapter
                                    </p>
                                    <p className='italic'>
                                        Santa Clara University &apos;26
                                    </p>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* What is AKPsi Section */}
            <section
                id='what-is-akpsi'
                className='py-16 relative h-screen flex items-center justify-center text-white overflow-hidden'
            >
                <motion.div
                    className='absolute inset-0'
                    initial={{ scale: 1.1 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                    viewport={{ once: true }}
                >
                    <Image
                        src='/images/brotherhood.jpg'
                        alt='Brotherhood'
                        fill
                        className='object-cover'
                    />
                </motion.div>
                <div className='absolute inset-0 bg-black/50' />
                <motion.div
                    className='container relative z-10'
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true, margin: '100px' }}
                >
                    <div className='max-w-4xl mx-auto text-center'>
                        <motion.h1
                            className='text-3xl md:text-4xl font-bold mb-4'
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            WHAT IS ALPHA KAPPA PSI?
                        </motion.h1>
                        <motion.div
                            className='font-light'
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <motion.h3
                                className='text-xl mb-6'
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                                viewport={{ once: true }}
                            >
                                Alpha Kappa Psi is the nation&apos;s oldest and
                                largest co-ed business fraternity. Since our
                                founding in 1904, we have grown to 298,000
                                initiated members, 219 active chapters in 4
                                different countries.
                            </motion.h3>
                            <motion.h3
                                className='text-xl mb-8'
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.9 }}
                                viewport={{ once: true }}
                            >
                                The Psi Omega chapter was founded at Santa Clara
                                University in 2005 and includes over 90 active
                                brothers across the College of Arts & Sciences,
                                Leavey School of Business, and School of
                                Engineering — making us the only professional
                                business fraternity on campus to accept all
                                majors.
                            </motion.h3>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.1 }}
                                viewport={{ once: true }}
                            >
                                <Button asChild variant={'link'} size={'lg'}>
                                    <Link href='/about-akpsi'>Learn more</Link>
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Rush Section */}
            <section id='rush-akpsi' className='py-32 bg-white'>
                <motion.div
                    className='container text-center'
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
                        RUSH AKPSI
                    </motion.h1>
                    <motion.h3
                        className='text-xl max-w-3xl mx-auto mb-8'
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        Take a chance and learn more about Alpha Kappa Psi and
                        how we can help you invest in your future and enhance
                        your college experience.
                    </motion.h3>
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
                            variant={'link'}
                            size={'lg'}
                            className='border-black hover:bg-black hover:text-white transition-all duration-300'
                        >
                            <Link href='/rush-akpsi'>RUSH AKPSI</Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </section>

            {/* Sponsors Section */}
            <section
                id='sponsors'
                className='py-32 bg-akpsi-blue relative text-white md:h-screen md:flex md:items-center md:justify-center'
            >
                <motion.div
                    className='container relative z-10'
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true, margin: '100px' }}
                >
                    <motion.h1
                        className='text-3xl md:text-4xl font-bold mb-12 md:mb-48 text-center'
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        THANK YOU TO OUR SPONSORS!!
                    </motion.h1>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                        {[
                            {
                                src: '/images/companies/deloitte.png',
                                alt: 'Deloitte',
                                name: 'Deloitte',
                                href: 'https://www2.deloitte.com/us/en/careers/careers.html',
                                delay: 0.2,
                            },
                            {
                                src: '/images/companies/kpmg.png',
                                alt: 'KPMG',
                                name: 'KPMG',
                                href: 'https://kpmg.com/xx/en/careers.html',
                                delay: 0.4,
                            },
                            {
                                src: '/images/companies/ey.png',
                                alt: 'EY',
                                name: 'EY',
                                href: 'https://www.ey.com/en_us/careers',
                                delay: 0.6,
                            },
                            {
                                src: '/images/companies/pwc.png',
                                alt: 'PwC',
                                name: 'PwC',
                                href: 'https://www.pwc.com/us/en/careers.html',
                                delay: 1.0,
                            },
                        ].map((sponsor) => (
                            <motion.div
                                key={sponsor.name}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: sponsor.delay,
                                }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.1 }}
                            >
                                <Link
                                    className='flex flex-col items-center hover:text-gray-300 transition-colors duration-300'
                                    href={sponsor.href}
                                    target='_blank'
                                >
                                    <motion.div
                                        className='w-64 h-52 flex items-center justify-center mb-12'
                                        whileHover={{ rotate: 5 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Image
                                            src={sponsor.src}
                                            alt={sponsor.alt}
                                            width={200}
                                            height={200}
                                            className='object-contain'
                                        />
                                    </motion.div>
                                    <motion.h3
                                        className='text-4xl font-bold'
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {sponsor.name}
                                    </motion.h3>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>
        </main>
    );
}
