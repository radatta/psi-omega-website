'use client';

import { useEffect } from 'react';
import Link from 'next/link';

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
        <main className='flex min-h-[calc(100vh-16rem)] items-center justify-center bg-gray-50 px-4 py-24'>
            <div className='max-w-lg text-center'>
                <h1 className='text-4xl font-bold text-akpsi-blue sm:text-5xl'>
                    Something went wrong
                </h1>
                <p className='mt-6 text-lg text-gray-600'>
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
                        className='rounded-lg bg-akpsi-blue px-6 py-3 font-semibold text-white transition-colors hover:bg-akpsi-blue/90'
                    >
                        Try again
                    </button>
                    <Link
                        href='/'
                        className='rounded-lg border border-gray-300 px-6 py-3 font-semibold text-akpsi-blue transition-colors hover:bg-white'
                    >
                        Back to home
                    </Link>
                </div>
            </div>
        </main>
    );
}
