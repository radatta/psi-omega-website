import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon } from '@radix-ui/react-icons';

export default function Home() {
    return (
        <main className='min-h-screen'>
            {/* Hero Section */}
            <section
                id='hero'
                className='relative h-screen flex items-center justify-center text-white'
            >
                <div className='absolute inset-0 z-0'>
                    <Image
                        src='/images/hero-background.jpg'
                        alt='Alpha Kappa Psi Brotherhood'
                        fill
                        className='object-cover'
                        priority
                    />
                    <div className='absolute inset-0 bg-black/50'></div>
                </div>
                <div className='container mx-auto px-4 z-10 text-center'>
                    <h1 className='text-4xl md:text-6xl font-bold mb-4'>
                        SHAPING PEOPLE, SHAPING BUSINESS
                    </h1>
                    <h3 className='text-xl md:text-2xl mb-8'>
                        Alpha Kappa Psi is recognized as the premier developer
                        of principled business leaders.
                    </h3>
                    <Button
                        asChild
                        className='bg-white text-black hover:bg-gray-200 hover:text-black'
                    >
                        <Link href='/about-akpsi'>Learn more</Link>
                    </Button>
                </div>
                <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center'>
                    <div className='text-sm mb-2'>Scroll</div>
                    <ChevronDownIcon className='mx-auto animate-bounce' />
                </div>
            </section>

            {/* President Letter Section */}
            <section id='letter-president' className='py-16 bg-white'>
                <div className='container mx-auto px-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                        <div className='flex justify-center'>
                            <div className='relative w-full max-w-md aspect-square'>
                                <Image
                                    src='/images/brothers/Fiona-Holdaway.jpg'
                                    alt='Chapter President'
                                    fill
                                    className='object-cover rounded-md'
                                />
                            </div>
                        </div>
                        <div>
                            <h1 className='text-3xl md:text-4xl font-bold mb-4'>
                                A LETTER FROM OUR PRESIDENT
                            </h1>
                            <p className='mb-4'>
                                On behalf of our chapter, I&apos;d like to
                                welcome you to our official website. This
                                platform offers a glimpse into who we are: our
                                values, goals, and the community we&apos;ve
                                built. Here, you&apos;ll find information about
                                our chapter&apos;s mission, our far-reaching
                                professional network, and the dynamic
                                individuals who make up our brotherhood.
                            </p>
                            <p className='mb-4'>
                                Alpha Kappa Psi is more than just a professional
                                fraternity. We are a diverse and driven group of
                                students who share a passion for leadership,
                                growth, and excellence. At the Psi Omega
                                chapter, every member brings a unique
                                perspective and skill set, creating a
                                collaborative environment where we challenge and
                                uplift one another in both professional and
                                personal pursuits.
                            </p>
                            <p className='mb-4'>
                                I joined Alpha Kappa Psi during my freshman year
                                at SCU, and it has been one of the most
                                impactful experiences of my college journey.
                                Through this fraternity, I&apos;ve built
                                lifelong friendships and found a support system
                                that has shaped who I am today. The last three
                                years have been transformative, and I am
                                incredibly honored to lead this inspiring and
                                dedicated chapter in the upcoming academic year.
                            </p>
                            <p className='mb-4'>
                                Alpha Kappa Psi has given me so much, and
                                I&apos;m excited to give back to the
                                organization and the people who have made it
                                feel like home.
                            </p>
                            <div className='text-right'>
                                <p>Best,</p>
                                <p>Fiona Holdaway </p>
                                <p className='italic'>
                                    President, Psi Omega Chapter
                                </p>
                                <p className='italic'>
                                    Santa Clara University &apos;26
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What is AKPsi Section */}
            <section id='what-is-akpsi' className='py-16 bg-gray-100 relative'>
                <div className='container mx-auto px-4 relative z-10'>
                    <div className='max-w-4xl mx-auto text-center'>
                        <h1 className='text-3xl md:text-4xl font-bold mb-4'>
                            WHAT IS ALPHA KAPPA PSI?
                        </h1>
                        <h3 className='text-xl mb-6'>
                            Alpha Kappa Psi is the nation&apos;s oldest and
                            largest co-ed business fraternity. Since our
                            founding in 1904, we have grown to 298,000 initiated
                            members, 219 active chapters in 4 different
                            countries.
                        </h3>
                        <h3 className='text-xl mb-8'>
                            The Psi Omega chapter was founded at Santa Clara
                            University in 2005 and includes over 90 active
                            brothers across the College of Arts & Sciences,
                            Leavey School of Business, and School of Engineering
                            — making us the only professional business
                            fraternity on campus to accept all majors.
                        </h3>
                        <Button asChild>
                            <Link href='/about-akpsi'>Learn more</Link>
                        </Button>
                    </div>
                </div>
                <div className='absolute inset-0 opacity-20'>
                    <Image
                        src='/images/brotherhood.jpg'
                        alt='Brotherhood'
                        fill
                        className='object-cover'
                    />
                </div>
            </section>

            {/* Rush Section */}
            <section id='rush-akpsi' className='py-16 bg-white'>
                <div className='container mx-auto px-4 text-center'>
                    <h1 className='text-3xl md:text-4xl font-bold mb-4'>
                        RUSH AKPSI
                    </h1>
                    <h3 className='text-xl max-w-3xl mx-auto mb-8'>
                        Take a chance and learn more about Alpha Kappa Psi and
                        how we can help you invest in your future and enhance
                        your college experience.
                    </h3>
                    <Button asChild>
                        <Link href='/rush-akpsi'>RUSH AKPSI</Link>
                    </Button>
                </div>
            </section>

            {/* Sponsors Section */}
            <section id='sponsors' className='py-16 bg-gray-100 relative'>
                <div className='absolute inset-0 opacity-20'>
                    <Image
                        src='/images/group-photo.jpg'
                        alt='Group Photo'
                        fill
                        className='object-cover'
                    />
                </div>
                <div className='container mx-auto px-4 relative z-10'>
                    <h1 className='text-3xl md:text-4xl font-bold mb-12 text-center'>
                        THANK YOU TO OUR SPONSORS!
                    </h1>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        <div className='flex flex-col items-center'>
                            <div className='w-40 h-40 flex items-center justify-center mb-4'>
                                <Image
                                    src='/images/kpmg-logo.png'
                                    alt='KPMG'
                                    width={150}
                                    height={150}
                                    className='object-contain'
                                />
                            </div>
                            <h3 className='text-xl font-bold'>
                                <a
                                    href='https://kpmg.com/xx/en/careers.html'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    KPMG
                                </a>
                            </h3>
                        </div>
                        <div className='flex flex-col items-center'>
                            <div className='w-40 h-40 flex items-center justify-center mb-4'>
                                <Image
                                    src='/images/ey-logo.png'
                                    alt='EY'
                                    width={150}
                                    height={150}
                                    className='object-contain'
                                />
                            </div>
                            <h3 className='text-xl font-bold'>
                                <a
                                    href='https://www.ey.com/en_us/careers'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    EY
                                </a>
                            </h3>
                        </div>
                        <div className='flex flex-col items-center'>
                            <div className='w-40 h-40 flex items-center justify-center mb-4'>
                                <Image
                                    src='/images/deloitte-logo.png'
                                    alt='Deloitte'
                                    width={150}
                                    height={150}
                                    className='object-contain'
                                />
                            </div>
                            <h3 className='text-xl font-bold'>
                                <a
                                    href='https://www2.deloitte.com/us/en/careers/careers.html'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    Deloitte
                                </a>
                            </h3>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
