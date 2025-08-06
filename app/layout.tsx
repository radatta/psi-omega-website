import type React from 'react';
import './globals.css';
import localFont from 'next/font/local';
import { Rubik } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import AnimatePage from '@/components/ui/animate-page';

const cerapro = localFont({
    src: [
        {
            path: '/../public/fonts/Cera-Pro-Thin.otf',
            weight: '100',
            style: 'normal',
        },
        {
            path: '/../public/fonts/Cera-Pro-Thin-Italic.otf',
            weight: '100',
            style: 'italic',
        },
        {
            path: '/../public/fonts/Cera-Pro-Light.otf',
            weight: '300',
            style: 'normal',
        },
        {
            path: '/../public/fonts/Cera-Pro-Light-Italic.otf',
            weight: '300',
            style: 'italic',
        },
        {
            path: '/../public/fonts/Cera-Pro-Regular.otf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '/../public/fonts/Cera-Pro-Regular-Italic.otf',
            weight: '400',
            style: 'italic',
        },
        {
            path: '/../public/fonts/Cera-Pro-Medium.otf',
            weight: '500',
            style: 'normal',
        },
        {
            path: '/../public/fonts/Cera-Pro-Medium-Italic.otf',
            weight: '500',
            style: 'italic',
        },
        {
            path: '/../public/fonts/Cera-Pro-Bold.otf',
            weight: '700',
            style: 'normal',
        },
        {
            path: '/../public/fonts/Cera-Pro-Bold-Italic.otf',
            weight: '700',
            style: 'italic',
        },
        {
            path: '/../public/fonts/Cera-Pro-Black.otf',
            weight: '900',
            style: 'normal',
        },
        {
            path: '/../public/fonts/Cera-Pro-Black-Italic.otf',
            weight: '900',
            style: 'italic',
        },
    ],
    variable: '--font-cera-pro', // for CSS variable usage
});

const rubik = Rubik({
    subsets: ['latin'],
    variable: '--font-rubik',
});

export const metadata = {
    title: 'SCU AKΨ | Alpha Kappa Psi at Santa Clara University',
    description:
        'Alpha Kappa Psi is the premier developer of principled business leaders at Santa Clara University.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang='en'
            suppressHydrationWarning
            className={`${cerapro.variable} ${rubik.variable}`}
        >
            <body className={cerapro.className}>
                <ThemeProvider
                    attribute='class'
                    defaultTheme='light'
                    // enableSystem
                    disableTransitionOnChange
                >
                    <AnimatePage>
                        <Navbar />
                        {children}
                        <Footer />
                    </AnimatePage>
                </ThemeProvider>
            </body>
        </html>
    );
}
