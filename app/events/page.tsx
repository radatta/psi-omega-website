import Image from 'next/image';

// Image data for the Brotherhood section
const brotherhoodImages = [
    { src: '/images/events/Brotherhood-1.jpg', alt: 'Brotherhood event' },
    { src: '/images/events/Brotherhood-2.jpg', alt: 'Brothers at the beach' },
    { src: '/images/events/Brotherhood-3.jpg', alt: 'Brotherhood retreat' },
    { src: '/images/events/Brotherhood-4.jpg', alt: 'Brotherhood gathering' },
    { src: '/images/events/Brotherhood-5.jpg', alt: 'Brothers hanging out' },
    { src: '/images/events/Brotherhood-6.jpg', alt: 'Company tour' },
    { src: '/images/events/Brotherhood-7.jpg', alt: 'Brotherhood event' },
    { src: '/images/events/Brotherhood-8.jpg', alt: 'Brotherhood retreat' },
    { src: '/images/events/Brotherhood-9.jpg', alt: 'Brothers bonding time' },
    { src: '/images/events/Brotherhood-10.jpg', alt: 'Group photo session' },
    { src: '/images/events/Brotherhood-11.jpg', alt: 'Weekend getaway' },
    { src: '/images/events/Brotherhood-12.jpg', alt: 'Brotherhood dinner' },
    { src: '/images/events/Brotherhood-13.jpg', alt: 'Outdoor adventure' },
    { src: '/images/events/Brotherhood-14.jpg', alt: 'Team building activity' },
    { src: '/images/events/Brotherhood-15.jpg', alt: 'Brothers celebrating' },
    { src: '/images/events/Brotherhood-16.jpg', alt: 'Social gathering' },
    { src: '/images/events/Brotherhood-17.jpg', alt: 'Brotherhood tradition' },
    { src: '/images/events/Brotherhood-18.jpg', alt: 'Fun times together' },
    { src: '/images/events/Brotherhood-19.jpg', alt: 'Brotherhood memories' },
];

// Image data for the Service section
const serviceImages = [
    { src: '/images/events/Service-1.jpg', alt: 'Community service event' },
    { src: '/images/events/Service-2.jpg', alt: 'Volunteering' },
    { src: '/images/events/Service-5.jpg', alt: 'Charity event' },
    { src: '/images/events/Service-7.jpg', alt: 'Volunteer event' },
    { src: '/images/events/Service-8.jpg', alt: 'Community service event' },
    { src: '/images/events/Service-3.jpg', alt: 'Beach cleanup' },
];

// Image data for the Professional section
const professionalImages = [
    {
        src: '/images/events/Professional-1.jpg',
        alt: 'Professional development workshop',
    },
    { src: '/images/events/Professional-2.jpg', alt: 'Company visit' },
    { src: '/images/events/Professional-3.jpg', alt: 'Guest speaker event' },
    {
        src: '/images/events/Professional-4.jpg',
        alt: 'Professional networking',
    },
    { src: '/images/events/Professional-5.jpg', alt: 'Career fair' },
    { src: '/images/events/Professional-6.jpg', alt: 'Professional training' },
];

export default function EventsPage() {
    return (
        <main className='min-h-screen'>
            {/* Hero Section */}
            <section
                id='our-events'
                className='relative h-screen flex items-center justify-center text-white'
            >
                <div className='absolute inset-0 z-0'>
                    <Image
                        src='/images/Events-Hero.jpg'
                        alt='AKPsi Events'
                        fill
                        className='object-cover'
                        priority
                    />
                    <div className='absolute inset-0 bg-black/50'></div>
                </div>
                <div className='container z-10 text-center'>
                    <h1 className='text-4xl md:text-6xl font-bold mb-4'>
                        OUR EVENTS
                    </h1>
                    <p className='text-xl max-w-3xl mx-auto'>
                        Check out what we&apos;ve done and stay updated with
                        what&apos;s next!
                    </p>
                </div>
            </section>

            {/* Past Events Section */}
            <section id='past-events' className='py-16 bg-white'>
                <div className='container space-y-32'>
                    {/* Brotherhood Section */}
                    <div className='flex flex-col md:flex-row items-start gap-12'>
                        {/* Text */}
                        <div className='md:w-2/5 md:sticky md:top-8'>
                            <h2 className='text-4xl font-bold mb-6 text-blue-900'>
                                BROTHERHOOD
                            </h2>
                            <div className='w-16 h-1 bg-blue-600 mb-8'></div>
                            <p className='text-lg leading-relaxed mb-8 text-gray-700'>
                                From spontaneous beach trips to Tahoe
                                brotherhood retreats, brotherhood has always
                                been an essential part of Alpha Kappa Psi.
                                Through our pledge process, brotherhood events,
                                and casual hangouts, life-long friendships are
                                formed.
                            </p>
                            <div className='bg-blue-50 p-6 rounded-lg'>
                                <h3 className='font-semibold text-blue-900 mb-2'>
                                    Recent Highlights
                                </h3>
                                <ul className='text-sm text-blue-800 space-y-1'>
                                    <li>• Annual Tahoe Retreat</li>
                                    <li>• Beach Day Adventures</li>
                                    <li>• Game Night Gatherings</li>
                                    <li>• Brotherhood Dinners</li>
                                </ul>
                            </div>
                        </div>
                        {/* Images - Masonry Layout */}
                        <div className='md:w-3/5'>
                            <div className='columns-2 md:columns-3 gap-4 space-y-4'>
                                {brotherhoodImages.map((image, index) => (
                                    <div
                                        key={index}
                                        className='break-inside-avoid mb-4'
                                    >
                                        <div className='relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105'>
                                            <Image
                                                src={
                                                    image.src ||
                                                    '/placeholder.svg'
                                                }
                                                alt={image.alt}
                                                width={300}
                                                height={300}
                                                className='w-full h-auto object-cover'
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Professional Section */}
                    <div className='bg-gray-50 -mx-8 px-8 py-16 rounded-2xl'>
                        <div className='flex flex-col md:flex-row items-start gap-12'>
                            {/* Images - Featured Layout */}
                            <div className='md:w-3/5 order-2 md:order-1'>
                                <div className='grid gap-4'>
                                    {/* Large featured image */}
                                    <div className='relative aspect-[16/9] overflow-hidden rounded-xl shadow-lg'>
                                        <Image
                                            src={
                                                professionalImages[0]?.src ||
                                                '/placeholder.svg'
                                            }
                                            alt={
                                                professionalImages[0]?.alt ||
                                                'Professional event'
                                            }
                                            fill
                                            className='object-cover'
                                        />
                                    </div>
                                    {/* Grid of smaller images */}
                                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                                        {professionalImages
                                            .slice(1)
                                            .map((image, index) => (
                                                <div
                                                    key={index + 1}
                                                    className='relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow'
                                                >
                                                    <Image
                                                        src={
                                                            image.src ||
                                                            '/placeholder.svg'
                                                        }
                                                        alt={image.alt}
                                                        fill
                                                        className='object-cover hover:scale-110 transition-transform duration-300'
                                                    />
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                            {/* Text */}
                            <div className='md:w-2/5 order-1 md:order-2'>
                                <h2 className='text-4xl font-bold mb-6 text-green-900'>
                                    PROFESSIONAL
                                </h2>
                                <div className='w-16 h-1 bg-green-600 mb-8'></div>
                                <p className='text-lg leading-relaxed mb-8 text-gray-700'>
                                    As a group of driven and passionate
                                    individuals, we take pride in our desire to
                                    learn and grow through professional
                                    experience. By attending events such as
                                    company tours, professional development
                                    workshops, and guest speaker conferences, we
                                    are given an amazing opportunity to grow
                                    into principled leaders.
                                </p>
                                <div className='bg-green-50 p-6 rounded-lg'>
                                    <h3 className='font-semibold text-green-900 mb-2'>
                                        Professional Development
                                    </h3>
                                    <ul className='text-sm text-green-800 space-y-1'>
                                        <li>• Company Tours & Visits</li>
                                        <li>• Guest Speaker Series</li>
                                        <li>• Networking Events</li>
                                        <li>• Career Workshops</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Service Section */}
                    <div className='flex flex-col md:flex-row items-start gap-12'>
                        {/* Text */}
                        <div className='md:w-2/5'>
                            <h2 className='text-4xl font-bold mb-6 text-red-900'>
                                SERVICE
                            </h2>
                            <div className='w-16 h-1 bg-red-600 mb-8'></div>
                            <p className='text-lg leading-relaxed mb-8 text-gray-700'>
                                Community service provides us the invaluable
                                opportunity to become an active member of
                                society. As a core value of Alpha Kappa Psi, we
                                are incredibly fortunate to serve and engage
                                with our community members who are in need of
                                support, compassion, and love.
                            </p>
                            <div className='bg-red-50 p-6 rounded-lg'>
                                <h3 className='font-semibold text-red-900 mb-2'>
                                    Community Impact
                                </h3>
                                <ul className='text-sm text-red-800 space-y-1'>
                                    <li>• Beach & Park Cleanups</li>
                                    <li>• Food Bank Volunteering</li>
                                    <li>• Community Outreach</li>
                                    <li>• Charity Fundraisers</li>
                                </ul>
                            </div>
                        </div>
                        {/* Images - Card Layout */}
                        <div className='md:w-3/5'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                {serviceImages.map((image, index) => (
                                    <div
                                        key={index}
                                        className='group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300'
                                    >
                                        <div className='relative aspect-[4/3]'>
                                            <Image
                                                src={
                                                    image.src ||
                                                    '/placeholder.svg'
                                                }
                                                alt={image.alt}
                                                fill
                                                className='object-cover group-hover:scale-110 transition-transform duration-500'
                                            />
                                            <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
