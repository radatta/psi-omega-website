import Image from 'next/image';

export default function HistorySection() {
    return (
        <section id='history' className='py-16 bg-white'>
            <div className='container mx-auto px-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
                    {/* Fraternity History */}
                    <div>
                        <h1 className='text-3xl md:text-4xl font-bold mb-4'>
                            FRATERNITY HISTORY
                        </h1>
                        <hr className='border-gray-300 mb-8' />

                        <h2 className='text-2xl font-semibold mb-4'>
                            BROOKLYN, NY | 1904
                        </h2>
                        <p className='mb-4'>
                            Alpha Kappa Psi is the oldest and largest co-ed
                            professional business fraternity in the United
                            States. Our history begins in the fall of 1902 when
                            four men began attending evening business classes
                            together at New York University. The Founders
                            occupied the same seats five nights a week. They
                            became acquainted with one another. The four men
                            from Brooklyn (Bergen, Jefferson, Lane, Leach),
                            later known as the Brooklyn Four, walked together
                            over the Brooklyn Bridge from school.
                        </p>
                        <p className='mb-8'>
                            The spirit of the brotherhood grew so strong in the
                            hearts and in the minds of the men from Brooklyn
                            that they decided to suggest to the other members of
                            their class that something be done to perpetuate it,
                            and Alpha Kappa Psi, the first professional
                            fraternity in business, was founded at an
                            organization meeting held on October 5, 1904. Later,
                            a formal application was made to the State of New
                            York for a chapter of incorporation for Alpha Kappa
                            Psi. The application was approved and the charter of
                            incorporation was issued in the name of Alpha Kappa
                            Psi on May 20, 1905.
                        </p>

                        <div className='relative h-96 w-full rounded-lg overflow-hidden'>
                            <Image
                                src='/images/fraternity-history.jpg'
                                alt='Fraternity History'
                                fill
                                className='object-cover'
                            />
                        </div>
                    </div>

                    {/* Chapter History */}
                    <div>
                        <div className='relative h-96 w-full rounded-lg overflow-hidden mb-8'>
                            <Image
                                src='/images/chapter-history.jpg'
                                alt='Chapter History'
                                fill
                                className='object-cover'
                            />
                        </div>

                        <h1 className='text-3xl md:text-4xl font-bold mb-4'>
                            CHAPTER HISTORY
                        </h1>
                        <hr className='border-gray-300 mb-8' />

                        <h2 className='text-2xl font-semibold mb-4'>
                            SANTA CLARA, CA | 2005
                        </h2>
                        <p className='mb-4'>
                            The Psi Omega chapter began at Santa Clara
                            University on January 8, 2005. More than just
                            another organization or club, we have grown into a
                            group of driven, unique, and passionate students,
                            professors, graduates, and professionals with common
                            interests and goals. We seek to develop principled
                            business leaders in alignment with our 5 core
                            values: Brotherhood, Knowledge, Service, Unity, and
                            Integrity. Psi Omega provides its brothers with
                            professional guidance in a variety of ways, such as
                            interview training, resume building, public
                            speaking, networking, etc.
                        </p>
                        <p className='mb-4'>
                            We pride ourselves on selecting the highest quality
                            candidates who exhibit leadership behavior and
                            potential within all majors and disciplines. Whether
                            your interests are in Finance, Bioengineering, or
                            Music, we look for students who exhibit drive,
                            dedication, and passion in all they do. Our brothers
                            are goal-oriented, focused, and dedicated to
                            applying business principles to their careers no
                            matter what path they choose. Because our brothers
                            come from all majors and backgrounds, our chapter is
                            able to offer countless opportunities for growth and
                            learning.
                        </p>
                        <p className='mb-4'>
                            Our alumni network runs deep into Silicon Valley and
                            extends into all industries and professions. Our
                            connections in the Bay Area have led to many
                            internships and full-time job offers for our
                            brothers, allowing us to form strong relationships
                            with these local companies. We invite you to join
                            our brotherhood to learn, laugh and grow with
                            individuals like you. So take the first steps to
                            create these lasting memories and become a part of
                            the lifelong experience of Alpha Kappa Psi.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
