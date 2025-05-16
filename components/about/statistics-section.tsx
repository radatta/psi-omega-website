import { PieChart } from '@/components/charts/pie-chart';
import {
    schoolsCollegesData,
    globalPopulationData,
    classDistributionData,
} from '@/lib/brothers_data';

export default function StatisticsSection() {
    return (
        <section id='statistics' className='py-16'>
            <div className='container'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-12'>
                    <div className='md:col-span-1'></div>
                    <div>
                        <h1 className='text-4xl md:text-5xl font-bold mb-8 md:text-right'>
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
                        <PieChart data={schoolsCollegesData} />
                    </div>

                    <div className='bg-white p-6 rounded-lg shadow-md'>
                        <h2 className='text-xl font-bold mb-4 text-center'>
                            Global Population
                        </h2>
                        <PieChart data={globalPopulationData} />
                    </div>

                    <div className='bg-white p-6 rounded-lg shadow-md'>
                        <h2 className='text-xl font-bold mb-4 text-center'>
                            Class Distribution
                        </h2>
                        <PieChart data={classDistributionData} />
                    </div>
                </div>
            </div>
        </section>
    );
}
