import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';

export default function Footer() {
    const navLinks = [
        { name: 'HOME', href: '/' },
        { name: 'ABOUT US', href: '/about-akpsi' },
        { name: 'MEET THE BROTHERS', href: '/meet-the-brothers' },
        { name: 'RUSH AKPSI', href: '/rush-akpsi' },
        { name: 'LEGACY', href: '/legacy' },
        { name: 'EVENTS', href: '/events' },
    ];

    const socialLinks = [
        {
            icon: <EnvelopeClosedIcon className='h-5 w-5' />,
            href: 'mailto:akpsi@scu.edu',
            label: 'Email',
        },
        {
            icon: <Facebook className='h-5 w-5' />,
            href: 'https://www.facebook.com/scuakpsi',
            label: 'Facebook',
        },
        {
            icon: <Instagram className='h-5 w-5' />,
            href: 'https://www.instagram.com/scuakpsi/',
            label: 'Instagram',
        },
    ];

    return (
        <footer className='bg-black text-white py-12'>
            <div className='container mx-auto px-4'>
                <div className='text-center mb-8'>
                    <nav className='flex flex-wrap justify-center gap-4 md:gap-8'>
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className='font-bold hover:text-gray-300 transition-colors'
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className='flex justify-center space-x-6 mb-8'>
                    {socialLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='bg-white text-black rounded-full p-3 hover:bg-gray-200 transition-colors'
                            aria-label={link.label}
                        >
                            {link.icon}
                        </a>
                    ))}
                </div>

                <div className='text-center text-sm text-gray-400'>
                    <p>
                        © {new Date().getFullYear()} Alpha Kappa Psi - Psi
                        Omega Chapter
                    </p>
                    <p>Santa Clara University</p>
                </div>
            </div>
        </footer>
    );
}
