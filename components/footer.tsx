import { Instagram } from 'lucide-react';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';

export default function Footer() {
    const socialLinks = [
        {
            icon: <EnvelopeClosedIcon className='h-5 w-5' />,
            href: 'mailto:akpsi@scu.edu',
            label: 'Email',
        },
        {
            icon: <Instagram className='h-5 w-5' />,
            href: 'https://www.instagram.com/scuakpsi/',
            label: 'Instagram',
        },
    ];

    return (
        <footer className='bg-black text-white py-12'>
            <div className='container'>
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
                        © {new Date().getFullYear()} Alpha Kappa Psi - Psi Omega
                        Chapter
                    </p>
                    <p>Santa Clara University</p>
                </div>
            </div>
        </footer>
    );
}
