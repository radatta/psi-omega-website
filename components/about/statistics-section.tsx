import Image from 'next/image';
import { PieChart } from '@/components/charts/pie-chart';

export default function StatisticsSection() {
    return (
        <section id='statistics' className='py-16 bg-gray-50'>
            <div className='container mx-auto px-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-12'>
                    <div className='md:col-span-1'></div>
                    <div>
                        <h1 className='text-3xl md:text-4xl font-bold mb-4 md:text-right'>
                            CHAPTER STATISTICS
                        </h1>
                        <hr className='border-gray-300 mb-8' />
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    <div className='bg-white p-6 rounded-lg shadow-md'>
                        <h2 className='text-xl font-bold mb-4 text-center'>
                            Schools & Colleges
                        </h2>
                        <PieChart
                            data={[
                                {
                                    name: 'Leavey School of Business',
                                    value: 56,
                                },
                                { name: 'School of Engineering', value: 10 },
                                {
                                    name: 'College of Arts and Sciences',
                                    value: 8,
                                },
                            ]}
                        />
                    </div>

                    <div className='bg-white p-6 rounded-lg shadow-md'>
                        <h2 className='text-xl font-bold mb-4 text-center'>
                            Global Population
                        </h2>
                        <PieChart
                            data={[
                                { name: 'United States of America', value: 65 },
                                { name: 'China', value: 2 },
                                { name: 'Canada', value: 2 },
                                { name: 'Philippines', value: 1 },
                                { name: 'India', value: 1 },
                                { name: 'Kyrgyzstan', value: 1 },
                                { name: 'Vietnam', value: 1 },
                                { name: 'Mexico', value: 1 },
                            ]}
                        />
                    </div>

                    <div className='bg-white p-6 rounded-lg shadow-md'>
                        <h2 className='text-xl font-bold mb-4 text-center'>
                            Class Distribution
                        </h2>
                        <PieChart
                            data={[
                                { name: 'First Year', value: 10 },
                                { name: 'Second Year', value: 23 },
                                { name: 'Third Year', value: 24 },
                                { name: 'Fourth Year', value: 17 },
                            ]}
                        />
                    </div>
                </div>

                <div className='mt-16 text-center'>
                    <h2 className='text-2xl font-bold mb-6'>
                        WE WOULD LIKE TO THANK OUR SPONSOR
                    </h2>
                    <div className='flex justify-center mb-4'>
                        <div className='relative h-16 w-64'>
                            <Image
                                src='/images/kpmg-logo.png'
                                alt='KPMG'
                                fill
                                className='object-contain'
                            />
                        </div>
                    </div>
                    <a
                        href='https://kpmg.com/xx/en/home/about/who-we-are.html'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 hover:underline'
                    >
                        COMPANY WEBSITE
                    </a>
                </div>
            </div>
        </section>
    );
}
