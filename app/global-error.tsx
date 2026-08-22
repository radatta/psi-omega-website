'use client';

import { useEffect } from 'react';

// Catches throws from the root layout itself — Navbar, Footer, AnimatePage —
// which app/error.tsx cannot, because it renders *inside* that layout. It must
// supply its own <html> and <body>, and it deliberately uses inline styles: a
// layout failure may mean the stylesheet never loaded.
//
// Not covered: `metadata` is a module-scope const evaluated at build time, so a
// bad metadataBase fails the build rather than reaching any boundary. That is
// what the validation in lib/utils/site-url.ts is for.
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html lang='en'>
            <body
                style={{
                    margin: 0,
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'hsl(220 60% 22%)',
                    color: '#ffffff',
                    fontFamily: 'system-ui, sans-serif',
                    textAlign: 'center',
                    padding: '2rem',
                }}
            >
                <div style={{ maxWidth: '32rem' }}>
                    <h1 style={{ fontSize: '2rem', margin: 0 }}>
                        Something went wrong
                    </h1>
                    <p style={{ marginTop: '1.5rem', color: '#d1d5db' }}>
                        The site failed to load. Please try again.
                    </p>
                    {error.digest && (
                        <p style={{ marginTop: '.5rem', color: '#9ca3af' }}>
                            Reference: {error.digest}
                        </p>
                    )}
                    <button
                        onClick={reset}
                        style={{
                            marginTop: '2rem',
                            padding: '.75rem 1.5rem',
                            borderRadius: '.5rem',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600,
                            backgroundColor: 'hsl(44 50% 52%)',
                            color: 'hsl(220 60% 22%)',
                        }}
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
