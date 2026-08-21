import Link from 'next/link';

export default function NotFound() {
    return (
        <main className='flex min-h-[calc(100vh-16rem)] items-center justify-center bg-gray-50 px-4 py-24'>
            <div className='max-w-lg text-center'>
                <p className='text-sm font-semibold tracking-widest text-akpsi-yellow'>
                    404
                </p>
                <h1 className='mt-4 text-4xl font-bold text-akpsi-blue sm:text-5xl'>
                    Page not found
                </h1>
                <p className='mt-6 text-lg text-gray-600'>
                    That page doesn&apos;t exist. It may have moved, or the link
                    may be out of date.
                </p>
                <div className='mt-10 flex flex-wrap items-center justify-center gap-4'>
                    <Link
                        href='/'
                        className='rounded-lg bg-akpsi-blue px-6 py-3 font-semibold text-white transition-colors hover:bg-akpsi-blue/90'
                    >
                        Back to home
                    </Link>
                    <Link
                        href='/rush-akpsi'
                        className='rounded-lg border border-gray-300 px-6 py-3 font-semibold text-akpsi-blue transition-colors hover:bg-white'
                    >
                        Rush AKPsi
                    </Link>
                </div>
            </div>
        </main>
    );
}
