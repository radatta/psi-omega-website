'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { Cross2Icon } from '@radix-ui/react-icons';

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

    return (
        <header className='relative'>
            <div className='absolute top-0 left-0 w-full z-50 bg-transparent text-white'>
                <div className='container'>
                    <div className='flex justify-between items-center py-4 m-0'>
                        <Link href='/' className='flex items-center'>
                            <Image
                                src='/images/akpsi-logo.png'
                                alt='SCU AKΨ Logo'
                                width={168}
                                height={70}
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className='hidden md:flex space-x-6'>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className='font-medium text-xl hover:text-gray-300 transition-colors'
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            className='md:hidden text-white'
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

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className='md:hidden bg-black/90 text-white'>
                        <nav className='flex flex-col py-4'>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className='px-4 py-2 hover:bg-gray-800 transition-colors'
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
