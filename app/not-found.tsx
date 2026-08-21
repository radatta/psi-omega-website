import Link from 'next/link';

// The navbar is absolutely positioned, transparent and white-on-nothing, so
// every page needs a dark area behind it. Hence the dark background and the
// top padding that clears the bar.
export default function NotFound() {
    return (
        <main className='flex min-h-screen items-center justify-center bg-akpsi-blue px-4 pt-40 pb-24'>
            <div className='max-w-lg text-center'>
                <p className='text-sm font-semibold tracking-widest text-akpsi-yellow'>
                    404
                </p>
                <h1 className='mt-4 text-4xl font-bold text-white sm:text-5xl'>
                    Page not found
                </h1>
                <p className='mt-6 text-lg text-gray-300'>
                    That page doesn&apos;t exist. It may have moved, or the link
                    may be out of date.
                </p>
                <div className='mt-10 flex flex-wrap items-center justify-center gap-4'>
                    <Link
                        href='/'
                        className='rounded-lg bg-akpsi-yellow px-6 py-3 font-semibold text-akpsi-blue transition-opacity hover:opacity-90'
                    >
                        Back to home
                    </Link>
                    <Link
                        href='/rush-akpsi'
                        className='rounded-lg border border-white/40 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10'
                    >
                        Rush AKPsi
                    </Link>
                </div>
            </div>
        </main>
    );
}
