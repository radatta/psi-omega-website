import { BrotherCard } from '@/components/brothers/BrotherCard';
import {
    executiveCommittee,
    committeeChairs,
    alphaLambda,
    alphaMu,
    alphaNu,
    alphaXi,
    alphaOmicron,
    alphaPi,
    alphaRho,
    alphaSigma,
} from '@/lib/brothers_data';
import Image from 'next/image';

export default function MeetTheBrotherhood() {
    return (
        <main className='min-h-screen'>
            {/* Hero Section */}
            <section
                id='rush-hero'
                className='relative h-screen flex items-center justify-center text-white'
            >
                <Image
                    src='/images/Group-Photo.jpg'
                    alt='Rush Alpha Kappa Psi'
                    fill
                    className='object-cover'
                    priority
                />

                <div className='container z-10 text-center'>
                    <h1 className='text-4xl md:text-6xl font-bold mb-4'>
                        MEET OUR BROTHERS
                    </h1>
                    <p className='text-lg max-w-3xl mx-auto'>
                        &quot;If you want to go fast, go alone. If you want to
                        go far, go together.&quot;
                    </p>

                    {/* Scroll indicator */}
                    <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            className='text-white'
                        >
                            <path d='M12 5v14M5 12l7 7 7-7' />
                        </svg>
                    </div>
                </div>
            </section>

            {/* Executive Committee Section */}
            <section className='py-16 bg-white'>
                <div className='container'>
                    <h2 className='text-4xl font-bold text-center mb-12'>
                        EXECUTIVE COMMITTEE
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {executiveCommittee.map((member, index) => (
                            <BrotherCard key={index} {...member} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Committee Chairs Section */}
            <section className='py-16'>
                <div className='container'>
                    <h2 className='text-4xl font-bold text-center mb-12'>
                        COMMITTEE CHAIRS
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {committeeChairs.map((member, index) => (
                            <div
                                key={index}
                                className='flex flex-col items-center'
                            >
                                <p className='text-center text-xl font-bold '>
                                    {member.position}
                                </p>
                                <h3 className='text-center text-gray-700'>
                                    {member.name}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Alpha Lambda | Fall 2021 */}
            <section className='py-16 bg-white'>
                <div className='container'>
                    <h2 className='text-4xl font-bold text-center mb-12'>
                        ALPHA LAMBDA | FALL 2021
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {alphaLambda.map((member, index) => (
                            <BrotherCard key={index} {...member} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Alpha Mu | Winter 2022 */}
            <section className='py-16 bg-gray-50'>
                <div className='container'>
                    <h2 className='text-4xl font-bold text-center mb-12'>
                        ALPHA MU | WINTER 2022
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {alphaMu.map((member, index) => (
                            <BrotherCard key={index} {...member} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Alpha Nu | Fall 2022 */}
            <section className='py-16 bg-white'>
                <div className='container'>
                    <h2 className='text-4xl font-bold text-center mb-12'>
                        ALPHA NU | FALL 2022
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {alphaNu.map((member, index) => (
                            <BrotherCard key={index} {...member} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Alpha Xi | Winter 2023 */}
            <section className='py-16 bg-gray-50'>
                <div className='container'>
                    <h2 className='text-4xl font-bold text-center mb-12'>
                        ALPHA XI | WINTER 2023
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {alphaXi.map((member, index) => (
                            <BrotherCard key={index} {...member} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Alpha Omicron | Fall 2023 */}
            <section className='py-16 bg-white'>
                <div className='container'>
                    <h2 className='text-4xl font-bold text-center mb-12'>
                        ALPHA OMICRON | FALL 2023
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {alphaOmicron.map((member, index) => (
                            <BrotherCard key={index} {...member} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Alpha Pi | Winter 2024 */}
            <section className='py-16 bg-gray-50'>
                <div className='container'>
                    <h2 className='text-4xl font-bold text-center mb-12'>
                        ALPHA PI | WINTER 2024
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {alphaPi.map((member, index) => (
                            <BrotherCard key={index} {...member} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Alpha Rho | Fall 2024 */}
            <section className='py-16 bg-white'>
                <div className='container'>
                    <h2 className='text-4xl font-bold text-center mb-12'>
                        ALPHA RHO | FALL 2024
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {alphaRho.map((member, index) => (
                            <BrotherCard key={index} {...member} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Alpha Sigma | Winter 2025 */}
            <section className='py-16 bg-white'>
                <div className='container'>
                    <h2 className='text-4xl font-bold text-center mb-12'>
                        ALPHA SIGMA | WINTER 2025
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {alphaSigma.map((member, index) => (
                            <BrotherCard key={index} {...member} />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
