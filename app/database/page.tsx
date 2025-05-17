import Image from 'next/image';
import Database from '@/components/database/Database';
export default function DatabasePage() {
    return (
        <main className='min-h-screen'>
            {/* Hero Section */}
            <section
                id='our-database'
                className='relative h-screen flex items-center justify-center text-white'
            >
                <div className='absolute inset-0 z-0'>
                    <Image
                        src='/images/database-hero.jpg'
                        alt='AKPsi Database'
                        fill
                        className='object-cover'
                        priority
                    />
                    <div className='absolute inset-0 bg-black/50'></div>
                </div>
                <div className='container z-10 text-center'>
                    <h1 className='text-4xl md:text-6xl font-bold mb-4'>
                        OUR DATABASE
                    </h1>
                    <p className='text-xl max-w-3xl mx-auto'>
                        Connect with professionals across all industries!
                    </p>
                </div>
            </section>

            {/* Database Section */}
            <Database />
        </main>
    );
}
