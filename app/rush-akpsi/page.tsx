'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import RushFAQ from '@/components/rush/rush-faq';

export default function RushPage() {
    return (
        <main className='min-h-screen'>
            {/* Hero Section */}
            <section
                id='rush-hero'
                className='relative h-screen flex items-center justify-center text-white'
            >
                <Image
                    src='/images/rush-hero.jpg'
                    alt='Rush Alpha Kappa Psi'
                    fill
                    className='object-cover'
                    priority
                />

                <div className='container mx-auto px-4 z-10 text-center'>
                    <h1 className='text-4xl md:text-6xl font-bold mb-4 animate-fade-in'>
                        RUSH ALPHA KAPPA PSI
                    </h1>
                    <p className='text-xl md:text-2xl animate-fade-in-delay'>
                        See yourself here? Take the first step toward your goals
                        and come out to rush!
                    </p>
                    <div className='mt-8 animate-fade-in-delay-longer'>
                        <Button
                            asChild
                            size='lg'
                            variant='outline'
                            className='bg-transparent text-white border-white hover:bg-white/20'
                        >
                            <a href='#rush-info'>Learn More</a>
                        </Button>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce'>
                    <svg
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
                    >
                        <path d='M12 5v14M5 12l7 7 7-7' />
                    </svg>
                </div>
            </section>

            <div className='relative z-10 bg-white'>
                {/* Rush Info Section */}
                <section id='rush-info' className='py-16 bg-white'>
                    <div className='container mx-auto px-4'>
                        <div className='text-center mb-8'>
                            <h1 className='text-3xl md:text-4xl font-bold mb-4'>
                                WINTER RUSH 2025
                            </h1>
                            <h2 className='text-xl md:text-2xl mb-2'>
                                January 13th - January 17th
                            </h2>
                            <h2 className='text-xl md:text-2xl mb-8'>
                                Week 2 of Winter Quarter.
                            </h2>
                        </div>

                        <div className='max-w-4xl mx-auto mb-8'>
                            <div className='relative aspect-[16/10] w-full'>
                                <Image
                                    src='/images/rush-flyer.jpeg'
                                    alt='Winter Rush 2025 Flyer'
                                    fill
                                    className='object-contain rounded-lg'
                                />
                            </div>
                        </div>

                        <div className='text-center mb-8'>
                            <Link
                                href='https://docs.google.com/forms/d/e/1FAIpQLSfn30kelbOHRGrevQ_jGyDSLr5sGsduVzPtnN5TFnToPEG1nQ/viewform?usp=sf_link'
                                target='_blank'
                                className='text-blue-600 hover:underline font-bold'
                            >
                                Join our Rush Mailing List!
                            </Link>
                        </div>

                        <div className='flex justify-center mb-12'>
                            <Button asChild size='lg'>
                                <Link
                                    href='https://docs.google.com/forms/d/e/1FAIpQLScvQsk5zOUZ-18KYJc3D4XR5ATR6GkHzEQn-Ug5E1bZdIjHCA/viewform?usp=sf_link'
                                    target='_blank'
                                >
                                    Application Due 1/15 @ 5:00 PM
                                </Link>
                            </Button>
                        </div>

                        <hr className='border-gray-300 mb-12' />

                        <div className='max-w-4xl mx-auto'>
                            <h3 className='text-xl font-semibold mb-4 text-center'>
                                Press play to see what Alpha Kappa Psi is all
                                about!
                            </h3>
                            <div className='aspect-video w-full'>
                                <iframe
                                    className='w-full h-full rounded-lg'
                                    src='https://www.youtube.com/embed/deYrnHClMUM'
                                    title='Alpha Kappa Psi Rush Video'
                                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id='faq' className='py-16 bg-gray-50'>
                    <div className='container mx-auto px-4'>
                        <h1 className='text-3xl md:text-4xl font-bold text-center mb-4'>
                            Frequently Asked Questions
                        </h1>
                        <hr className='border-gray-300 w-24 mx-auto mb-12' />

                        <div className='max-w-4xl mx-auto'>
                            <RushFAQ />
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section
                    id='contact'
                    className='relative h-screen py-20 text-white'
                >
                    <div className='absolute inset-0 z-0'>
                        <Image
                            src='/images/contact-bg.jpg'
                            alt='Contact Background'
                            fill
                            className='object-cover'
                        />
                        <div className='absolute inset-0 bg-black/60'></div>
                    </div>
                    <div className='container mx-auto px-4 relative z-10 text-center'>
                        <h1 className='text-3xl md:text-5xl font-bold mb-4'>
                            Contact Us
                        </h1>
                        <p className='text-xl mb-8'>
                            For questions or concerns regarding Rush, please
                            email <strong>akpsi@scu.edu</strong>.
                        </p>
                        <Button
                            asChild
                            size='lg'
                            className='bg-white text-black hover:bg-gray-200'
                        >
                            <a href='mailto:akpsi@scu.edu'>
                                <Mail className='mr-2 h-4 w-4' /> ASK ABOUT RUSH
                            </a>
                        </Button>
                    </div>
                </section>
            </div>
        </main>
    );
}
