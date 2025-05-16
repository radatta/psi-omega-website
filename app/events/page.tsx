import Image from 'next/image';

// Image data for the Brotherhood section
const brotherhoodImages = [
    { src: '/images/events/Brotherhood-1.jpg', alt: 'Brotherhood event' },
    { src: '/images/events/Brotherhood-2.jpg', alt: 'Brothers at the beach' },
    { src: '/images/events/Brotherhood-3.jpg', alt: 'Brotherhood retreat' },
    { src: '/images/events/Brotherhood-4.jpg', alt: 'Brotherhood gathering' },
    { src: '/images/events/Brotherhood-5.jpg', alt: 'Brothers hanging out' },
    { src: '/images/events/Brotherhood-6.jpg', alt: 'Company tour' },
];

// Image data for the Service section
const serviceImages = [
    { src: '/images/events/Service-1.jpg', alt: 'Community service event' },
    { src: '/images/events/Service-2.jpg', alt: 'Volunteering' },
    { src: '/images/events/Service-3.jpg', alt: 'Beach cleanup' },
    { src: '/images/events/Service-4.jpg', alt: 'Service project' },
    { src: '/images/events/Service-5.jpg', alt: 'Charity event' },
    { src: '/images/events/Service-6.jpg', alt: 'Fundraising event' },
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
                <div className='container space-y-24'>
                    {/* Brotherhood: Text Left, Photos Right */}
                    <div className='flex flex-col md:flex-row items-center md:items-start gap-12'>
                        {/* Text */}
                        <div className='md:w-1/2'>
                            <h2 className='text-3xl font-bold mb-4'>
                                BROTHERHOOD
                            </h2>
                            <hr className='border-gray-300 mb-8' />
                            <p className='mb-8'>
                                From spontaneous beach trips to Tahoe
                                brotherhood retreats, brotherhood has always
                                been an essential part of Alpha Kappa Psi.
                                Through our pledge process, brotherhood events,
                                and casual hangouts, life-long friendships are
                                formed.
                            </p>
                        </div>
                        {/* Images */}
                        <div className='md:w-1/2 grid grid-cols-2 md:grid-cols-3 gap-5'>
                            {brotherhoodImages.map((image, index) => (
                                <div
                                    key={index}
                                    className='relative aspect-square overflow-hidden rounded-md shadow-md hover:shadow-lg transition-shadow'
                                >
                                    <Image
                                        src={image.src || '/placeholder.svg'}
                                        alt={image.alt}
                                        fill
                                        className='object-cover'
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Professional: Photos Left, Text Right */}
                    <div className='flex flex-col md:flex-row items-center md:items-start gap-12'>
                        {/* Images */}
                        <div className='md:w-1/2 order-2 md:order-1 grid grid-cols-2 md:grid-cols-3 gap-5'>
                            {professionalImages.map((image, index) => (
                                <div
                                    key={index}
                                    className='relative aspect-square overflow-hidden rounded-md shadow-md hover:shadow-lg transition-shadow'
                                >
                                    <Image
                                        src={image.src || '/placeholder.svg'}
                                        alt={image.alt}
                                        fill
                                        className='object-cover'
                                    />
                                </div>
                            ))}
                        </div>
                        {/* Text */}
                        <div className='md:w-1/2 order-1 md:order-2'>
                            <h2 className='text-3xl font-bold mb-4'>
                                PROFESSIONAL
                            </h2>
                            <hr className='border-gray-300 mb-8' />
                            <p className='mb-8'>
                                As a group of driven and passionate individuals,
                                we take pride in our desire to learn and grow
                                through professional experience. By attending
                                events such as company tours, professional
                                development workshops, and guest speaker
                                conferences, we are given an amazing opportunity
                                to grow into principled leaders.
                            </p>
                        </div>
                    </div>

                    {/* Service: Text Left, Photos Right */}
                    <div className='flex flex-col md:flex-row items-center md:items-start gap-12'>
                        {/* Text */}
                        <div className='md:w-1/2'>
                            <h2 className='text-3xl font-bold mb-4'>SERVICE</h2>
                            <hr className='border-gray-300 mb-8' />
                            <p className='mb-8'>
                                Community service provides us the invaluable
                                opportunity to become an active member of
                                society. As a core value of Alpha Kappa Psi, we
                                are incredibly fortunate to serve and engage
                                with our community members who are need of
                                support, compassion, and love.
                            </p>
                        </div>
                        {/* Images */}
                        <div className='md:w-1/2 grid grid-cols-2 md:grid-cols-3 gap-5'>
                            {serviceImages.map((image, index) => (
                                <div
                                    key={index}
                                    className='relative aspect-square overflow-hidden rounded-md shadow-md hover:shadow-lg transition-shadow'
                                >
                                    <Image
                                        src={image.src || '/placeholder.svg'}
                                        alt={image.alt}
                                        fill
                                        className='object-cover'
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
