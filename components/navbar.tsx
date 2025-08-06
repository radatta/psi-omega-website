'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'HOME', href: '/' },
        { name: 'ABOUT US', href: '/about-akpsi' },
        { name: 'MEET THE BROTHERS', href: '/meet-the-brothers' },
        { name: 'RUSH AKPSI', href: '/rush-akpsi' },
        { name: 'LEGACY', href: '/legacy' },
        { name: 'EVENTS', href: '/events' },
        { name: 'DATABASE', href: '/database' },
    ];

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    return (
        <header className='relative'>
            <div className='absolute top-0 left-0 w-full z-50 bg-transparent text-white py-4'>
                <div className='container'>
                    <div className='flex justify-between items-center m-0'>
                        <Link
                            href='/'
                            className='flex items-center transition-all duration-300'
                        >
                            <Image
                                src='/images/akpsi-logo.png'
                                alt='SCU AKΨ Logo'
                                width={168}
                                height={70}
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className='hidden lg:flex space-x-10'>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className='font-medium text-xl hover:text-gray-300 transition-colors relative group py-3'
                                >
                                    {link.name}
                                    <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-current group-hover:w-full transition-all duration-300'></span>
                                </Link>
                            ))}
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            className='lg:hidden text-white hover:cursor-pointer'
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label='Toggle menu'
                        >
                            {mobileMenuOpen ? (
                                <Cross2Icon className='h-6 w-6' />
                            ) : (
                                <Menu size={24} />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Centered Drawer */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                className='fixed inset-0 bg-black/30 backdrop-blur-md z-40 lg:hidden'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => setMobileMenuOpen(false)}
                            />

                            {/* Centered Drawer */}
                            <motion.div
                                className='fixed inset-0 z-50 flex items-center justify-center lg:hidden pointer-events-none'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.div
                                    className='bg-white/90 backdrop-blur-lg w-[85%] max-w-md rounded-2xl shadow-2xl pointer-events-auto overflow-hidden'
                                    initial={{ scale: 0.9, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.9, y: 20 }}
                                    transition={{
                                        type: 'spring',
                                        damping: 25,
                                        stiffness: 300,
                                    }}
                                >
                                    <div className='relative'>
                                        {/* Close Button */}
                                        <button
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                            className='absolute top-4 right-4 p-2 rounded-full bg-white/50 hover:bg-white/80 transition-colors z-10 hover:cursor-pointer'
                                            aria-label='Close menu'
                                        >
                                            <Cross2Icon className='h-5 w-5 text-gray-700' />
                                        </button>

                                        {/* Logo */}
                                        <div className='flex justify-center pt-8 pb-4'>
                                            <Image
                                                src='/images/akpsi-logo.png'
                                                alt='SCU AKΨ Logo'
                                                width={100}
                                                height={42}
                                                className='h-10 w-auto invert'
                                            />
                                        </div>

                                        {/* Navigation Links */}
                                        <nav className='px-6 pt-2 pb-8'>
                                            <div className='space-y-2'>
                                                {navLinks.map((link, index) => (
                                                    <motion.div
                                                        key={link.name}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{
                                                            delay:
                                                                index * 0.05 +
                                                                0.1,
                                                            duration: 0.3,
                                                        }}
                                                        className='text-center'
                                                    >
                                                        <Link
                                                            href={link.href}
                                                            className='inline-block w-full py-4 text-gray-600 font-medium text-lg tracking-wide hover:text-black transition-all duration-200'
                                                            onClick={() =>
                                                                setMobileMenuOpen(
                                                                    false
                                                                )
                                                            }
                                                        >
                                                            <span className='relative group'>
                                                                {link.name}
                                                                <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300'></span>
                                                            </span>
                                                        </Link>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </nav>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}
