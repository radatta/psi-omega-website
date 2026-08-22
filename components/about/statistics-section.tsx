import { useEffect, useRef, useCallback, useState } from 'react';
import { Users, GraduationCap, Building } from 'lucide-react';
import React from 'react';
import { motion } from 'motion/react';
import CountUp from 'react-countup';
import { totalMajors, totalMembers } from '@/lib/utils/roster';

// Members and majors are derived from the pledge-class rosters, so adding a
// class updates them. Alumni cannot be: the only record is the alumni sheet,
// which is not in this repo. Counted from it on 2026-08-22 — 369 unique names,
// less the 72 who are still active brothers — giving 297 on record.
//
// Rounded up to 300, which StatItem renders as "300+". That reads as a claim of
// at least 300, three more than were counted, and it holds only because the
// sheet is an incomplete record: 40 pledge classes are represented but plenty
// of older alumni were never entered. It is a floor, not a measurement. Drop it
// to 290 if you want the "+" to be true on the counted number alone.
// See docs/database.md for how to recount rather than nudging this by hand.
const totalAlumni = 300;

// StatItem component with forwardRef to get references for animations
interface StatItemProps {
    icon: React.ReactNode;
    number: number;
    label: string;
    shouldStart: boolean;
    duration: number;
}

const StatItem = React.forwardRef<HTMLDivElement, StatItemProps>(
    ({ icon, number, label, shouldStart, duration }, ref) => {
        return (
            <div
                ref={ref}
                className='flex flex-col items-center justify-center opacity-0'
            >
                <div className='text-gray-400 hover:text-black transition-colors duration-300 mb-4'>
                    {icon}
                </div>
                <div className='text-5xl md:text-6xl font-bold text-black mb-2'>
                    {shouldStart ? (
                        <CountUp end={number} duration={duration} suffix='+' />
                    ) : (
                        '0+'
                    )}
                </div>
                <div className='text-sm tracking-widest text-gray-500 font-medium'>
                    {label}
                </div>
            </div>
        );
    }
);

StatItem.displayName = 'StatItem';

export default function StatisticsSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const statsRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [shouldStartCounters, setShouldStartCounters] = useState(false);

    // Function to set refs safely
    const setStatRef = useCallback(
        (index: number) => (el: HTMLDivElement | null) => {
            statsRefs.current[index] = el;
        },
        []
    );

    useEffect(() => {
        const section = sectionRef.current;
        const stats = statsRefs.current.filter(Boolean);

        if (!section || stats.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    // Animate stats one after another with a stagger
                    stats.forEach((stat, index) => {
                        if (!stat) return;

                        setTimeout(() => {
                            // Fade in and move up animation
                            stat.style.opacity = '0';
                            stat.style.transform = 'translateY(20px)';

                            // Animate with CSS transitions
                            setTimeout(() => {
                                stat.style.transition =
                                    'opacity 0.5s ease, transform 0.5s ease';
                                stat.style.opacity = '1';
                                stat.style.transform = 'translateY(0)';
                            }, 10);
                        }, index * 100); // 100ms stagger
                    });

                    // Start counter animations after a slight delay
                    setTimeout(() => {
                        setShouldStartCounters(true);
                    }, 300);

                    // Unobserve after animation
                    observer.unobserve(section);
                }
            },
            { threshold: 0.2 }
        );

        observer.observe(section);

        return () => observer.disconnect();
    }, []);

    return (
        <section
            id='statistics'
            ref={sectionRef}
            className='py-20 md:py-24 bg-gradient-to-b relative overflow-hidden'
        >
            <motion.div
                className='absolute inset-0 z-0'
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.5 }}
                viewport={{ once: true, margin: '100px' }}
            ></motion.div>

            <div className='container relative z-10'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <div>
                        <h1 className='text-3xl md:text-5xl font-bold mb-8 whitespace-nowrap'>
                            CHAPTER BY THE NUMBERS
                        </h1>
                        <hr className='border-gray-300 mb-8' />
                    </div>
                    <div className='md:col-span-1'></div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8'>
                    {/* Members Stat */}
                    <StatItem
                        ref={setStatRef(0)}
                        icon={<Users strokeWidth={1.5} className='h-20 w-20' />}
                        number={totalMembers}
                        label='MEMBERS'
                        shouldStart={shouldStartCounters}
                        duration={4.4}
                    />

                    {/* Majors Stat */}
                    <StatItem
                        ref={setStatRef(1)}
                        icon={
                            <GraduationCap
                                strokeWidth={1.5}
                                className='h-20 w-20'
                            />
                        }
                        number={totalMajors}
                        label='MAJORS'
                        shouldStart={shouldStartCounters}
                        duration={4.7}
                    />

                    {/* Alumni Stat */}
                    <StatItem
                        ref={setStatRef(2)}
                        icon={
                            <Building strokeWidth={1.5} className='h-20 w-20' />
                        }
                        number={totalAlumni}
                        label='ALUMNI'
                        shouldStart={shouldStartCounters}
                        duration={5.2}
                    />
                </div>
            </div>
        </section>
    );
}
