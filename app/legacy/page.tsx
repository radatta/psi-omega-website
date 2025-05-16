import Image from 'next/image';
import AnimatedOverlaySection from '@/components/legacy/AnimatedOverlaySection';
import { companies } from '@/lib/legacy_data';

export default function LegacyPage() {
    return (
        <main className='min-h-screen pb-16'>
            {/* Network Section */}
            <section
                id='network'
                className='relative h-screen flex items-center justify-center text-white'
            >
                <div className='absolute inset-0 z-0'>
                    <Image
                        src='/images/legacy-hero.jpg'
                        alt='AKPsi Network'
                        fill
                        className='object-cover'
                        priority
                    />
                    <div className='absolute inset-0 bg-black/50'></div>
                </div>
                <div className='container z-10 text-center'>
                    <h1 className='text-4xl md:text-6xl font-bold mb-4'>
                        OUR NETWORK
                    </h1>
                    <p className='text-xl max-w-3xl mx-auto'>
                        From internships to full-time offers, our brothers have
                        secured positions spanning a variety of industries.
                        Check out this list to see some employers of our
                        brothers!
                    </p>
                </div>
            </section>

            {/* Companies Section */}
            <section id='companies' className='py-16 bg-white'>
                <div className='container'>
                    <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8'>
                        {companies.map((company, index) => (
                            <div
                                key={index}
                                className='flex items-center justify-center p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow'
                            >
                                <div className='flex items-center justify-center aspect-square w-24 h-24'>
                                    <Image
                                        src={`/images/companies/${company.logo}`}
                                        alt={company.name}
                                        width={96}
                                        height={96}
                                        className='object-contain w-full h-full'
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Campus Involvement Section (Animated Overlay) */}
            <AnimatedOverlaySection />
        </main>
    );
}
