'use client';

import { useEffect } from 'react';
import Link from 'next/link';

// Dark background for the same reason as not-found.tsx: the navbar is
// transparent and white, so a light page makes it unreadable.
export default function Error({
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
        <main className='flex min-h-screen items-center justify-center bg-akpsi-blue px-4 pt-40 pb-24'>
            <div className='max-w-lg text-center'>
                <h1 className='text-4xl font-bold text-white sm:text-5xl'>
                    Something went wrong
                </h1>
                <p className='mt-6 text-lg text-gray-300'>
                    This page failed to load. Trying again usually fixes it.
                </p>
                {error.digest && (
                    <p className='mt-2 text-sm text-gray-400'>
                        Reference: {error.digest}
                    </p>
                )}
                <div className='mt-10 flex flex-wrap items-center justify-center gap-4'>
                    <button
                        onClick={reset}
                        className='rounded-lg bg-akpsi-yellow px-6 py-3 font-semibold text-akpsi-blue transition-opacity hover:opacity-90'
                    >
                        Try again
                    </button>
                    <Link
                        href='/'
                        className='rounded-lg border border-white/40 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10'
                    >
                        Back to home
                    </Link>
                </div>
            </div>
        </main>
    );
}
