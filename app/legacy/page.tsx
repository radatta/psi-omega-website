import Image from 'next/image';
import AnimatedOverlaySection from '@/components/legacy/AnimatedOverlaySection';

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

            {/* Campus Organizations Section */}
            <section id='campus-involvement' className='py-16 bg-white'>
                <div className='container'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        {/* Column 1 */}
                        <div>
                            {campusOrganizations
                                .slice(
                                    0,
                                    Math.ceil(campusOrganizations.length / 3)
                                )
                                .map((org, index) => (
                                    <p key={index} className='text-center mb-3'>
                                        {org}
                                    </p>
                                ))}
                        </div>

                        {/* Column 2 */}
                        <div>
                            {campusOrganizations
                                .slice(
                                    Math.ceil(campusOrganizations.length / 3),
                                    Math.ceil(campusOrganizations.length / 3) *
                                        2
                                )
                                .map((org, index) => (
                                    <p key={index} className='text-center mb-3'>
                                        {org}
                                    </p>
                                ))}
                        </div>

                        {/* Column 3 */}
                        <div>
                            {campusOrganizations
                                .slice(
                                    Math.ceil(campusOrganizations.length / 3) *
                                        2
                                )
                                .map((org, index) => (
                                    <p key={index} className='text-center mb-3'>
                                        {org}
                                    </p>
                                ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Back to Top Button */}
            <div className='fixed bottom-8 right-8 z-50'>
                <a
                    href='#network'
                    className='bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors'
                    aria-label='Back to top'
                >
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
                    >
                        <path d='M12 19V5M5 12l7-7 7 7' />
                    </svg>
                </a>
            </div>
        </main>
    );
}

// Company data
const companies = [
    { name: 'Accenture', logo: 'accenture.jpg' },
    { name: 'Amazon', logo: 'amazon.jpg' },
    { name: 'Apple', logo: 'apple.jpg' },
    { name: 'Cisco', logo: 'Cisco_Logo.jpg' },
    { name: 'Deloitte', logo: 'deloitte-logo.jpg' },
    { name: 'EY', logo: 'EY.jpg' },
    { name: 'Google', logo: 'google.jpg' },
    { name: 'Intel', logo: 'intel.jpg' },
    { name: 'KPMG', logo: 'kpmg.jpg' },
    { name: 'LinkedIn', logo: 'linkedin.jpg' },
    { name: 'VMware', logo: 'vmware.jpg' },
    { name: 'Oracle', logo: 'Oracle.jpg' },
    { name: 'PwC', logo: 'pwc.jpg' },
    { name: 'Salesforce', logo: 'salesforce.jpg' },
    { name: 'Tesla', logo: 'tesla.jpg' },
    { name: 'Visa', logo: 'visas.jpg' },
    { name: 'Walmart', logo: 'walmart.jpg' },
    { name: 'Yahoo', logo: 'Yahoo_3.jpg' },
    { name: 'Zappos', logo: 'Zappos.jpg' },
    { name: 'JP Morgan Chase', logo: 'JP-Morgan-Chase-Emblem.jpg' },
    { name: 'Target', logo: 'target.jpg' },
    { name: 'Snowflake', logo: 'snow.jpg' },
    { name: 'Pottery Barn', logo: 'PotteryBarn.jpg' },
    { name: 'Onerent', logo: 'onerent.jpg' },
    { name: 'Juniper', logo: 'juniper.jpg' },
    { name: 'Flextronics', logo: 'Flextronics.jpg' },
    { name: 'Allegiant Air', logo: 'Allegiant-Air.jpg' },
    { name: 'Adaptive Insights', logo: 'adaptiveinsights.jpg' },
    { name: 'Yelp', logo: 'yelp.jpg' },
    { name: 'Presidio Bank', logo: 'presidiobank.jpg' },
    { name: 'Net Impact', logo: 'netimpact.jpg' },
    { name: 'NetApp', logo: 'netap.jpg' },
    { name: 'NBCUniversal', logo: 'NBCUniversal.jpg' },
    { name: 'Mercedes-Benz', logo: 'Mercedes-Benz.jpg' },
    { name: 'Intuitive Surgical', logo: 'intuitivesurgical.jpg' },
    { name: 'Imprivata', logo: 'Imprivata.jpg' },
    { name: 'Hitachi', logo: 'hitachi.jpg' },
    { name: 'Gap', logo: 'gap.jpg' },
    { name: 'FireEye', logo: 'fireeye.jpg' },
    { name: 'Blach', logo: 'blach.jpg' },
    { name: 'Applied Materials', logo: 'Applied-Materials.jpg' },
    { name: 'Dolby', logo: 'dolby.jpg' },
];

// Campus organizations data
const campusOrganizations = [
    'Accounting Association',
    'ACE Leadership Program',
    'Activities Programming Board',
    'Associated Student Government',
    'Association of Computer Machinery',
    'Barkada',
    'Beta Gamma Sigma',
    'Boxing Team',
    'Center for Student Leadership',
    'Chinese Student Association',
    'CLASP',
    'Economics Student Association',
    'Emergency Medical Services',
    'Engineers Without Borders',
    'Global Medical Brigades',
    'Hero Projects',
    'Ignatian Center',
    'Igwebuike',
    'Intandesh',
    'Into the Wild',
    "Ka Mana'o O Hawai'i",
    'LEAD Scholars Program',
    'Leavey Scholars Program',
    'LSB Peer Advisors',
    'Miller Center for Social Entrepreneurship',
    'Multicultural Center',
    'Mock Trial',
    'Neighborhood Prosperity Initiative',
    'Office of Multicultural Learning',
    'Office of Residence Life',
    'OMIS Student Network',
    'Orientation Leadership Staff',
    'Peer Judicial Board',
    'Santa Clara Community Action Program',
    'SCU Motor Sport',
    'Santa Clara Consulting',
    'Santa Clara Investment Fund',
    'Santa Clara Review',
    'Senior Leadership Academy',
    'Spoon University',
    'Student Ambassadors',
    'Taiwanese Student Association',
    'The Santa Clara',
    'Undergraduate Marketing Association',
    'University Honors Program',
    'University Housing',
    'Women in Business',
    'Women in Investment',
    'Women in STEM',
    'Wonderfully Made',
    'Young Life',
];
