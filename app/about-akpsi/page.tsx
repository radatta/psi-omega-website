import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ValuesSection from '@/components/about/values-section';
import StatisticsSection from '@/components/about/statistics-section';
import HistorySection from '@/components/about/history-section';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';

export default function AboutPage() {
    return (
        <main className='min-h-screen'>
            {/* Hero Section */}
            <section
                id='psi-omega-chapter'
                className='relative h-screen flex items-center justify-center text-white'
            >
                <div className='absolute inset-0 z-0'>
                    <Image
                        src='/images/about-hero.png'
                        alt='Psi Omega Chapter'
                        fill
                        className='object-cover'
                        priority
                    />
                    <div className='absolute inset-0 bg-black/50'></div>
                </div>
                <div className='container z-10 text-center'>
                    <h1 className='text-4xl md:text-6xl font-bold mb-4'>
                        PSI OMEGA CHAPTER
                    </h1>
                    <p className='text-xl md:text-2xl'>
                        Brotherhood · Knowledge · Integrity · Service · Unity
                    </p>
                </div>
            </section>

            {/* Values Section */}
            <ValuesSection />

            {/* Statistics Section */}
            <StatisticsSection />

            {/* History Section */}
            <HistorySection />

            {/* Contact Section */}
            <section
                id='question'
                className='relative h-screen flex items-center justify-center py-20 text-white'
            >
                <div className='absolute inset-0 z-0'>
                    <Image
                        src='/images/Got-A-Question.jpg'
                        alt='Contact Background'
                        fill
                        className='object-fill'
                    />
                    <div className='absolute inset-0 bg-black/60'></div>
                </div>
                <div className='container relative z-10 text-center'>
                    <h1 className='text-3xl md:text-5xl font-bold mb-4'>
                        GOT A QUESTION?
                    </h1>
                    <p className='text-xl mb-8'>
                        For any general questions, please email{' '}
                        <strong>akpsi@scu.edu</strong>
                    </p>
                    <Button
                        asChild
                        size='lg'
                        className='bg-white text-black hover:bg-gray-200'
                    >
                        <a href='mailto:akpsi@scu.edu'>
                            <EnvelopeClosedIcon className='mr-2 h-4 w-4' />{' '}
                            EMAIL US
                        </a>
                    </Button>
                </div>
            </section>
        </main>
    );
}
