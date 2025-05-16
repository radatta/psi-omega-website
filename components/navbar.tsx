'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';
import { Cross2Icon } from '@radix-ui/react-icons';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isMobile = useMobile();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About Us', href: '/about-akpsi' },
        { name: 'Meet the Brothers', href: '/meet-the-brothers' },
        { name: 'Rush AKPsi', href: '/rush-akpsi' },
        { name: 'Legacy', href: '/legacy' },
        { name: 'Events', href: '/events' },
        { name: 'Database', href: '/database' },
        { name: 'Advice', href: '/advice' },
    ];

    return (
        <header
            className={`fixed w-full z-50 transition-all duration-300 ${
                isScrolled || mobileMenuOpen || isMobile
                    ? 'bg-black/90 text-white'
                    : 'bg-transparent text-white'
            }`}
        >
            <div className='container mx-auto px-4'>
                <div className='flex justify-between items-center py-4'>
                    <Link href='/' className='flex items-center'>
                        <Image
                            src='/images/akpsi-logo.png'
                            alt='SCU AKΨ Logo'
                            width={120}
                            height={50}
                            className='h-12 w-auto'
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className='hidden md:flex space-x-6'>
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className='font-medium hover:text-gray-300 transition-colors'
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
                            <Cross2Icon size={24} />
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
        </header>
    );
}
