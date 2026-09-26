'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

type Parts = { days: number; hours: number; minutes: number; seconds: number };

const partsUntil = (target: number): Parts | null => {
    const s = Math.floor((target - Date.now()) / 1000);
    if (s <= 0) return null;
    return {
        days: Math.floor(s / 86400),
        hours: Math.floor(s / 3600) % 24,
        minutes: Math.floor(s / 60) % 60,
        seconds: s % 60,
    };
};

// Rolls the new digit up into place when it changes.
const Digit = ({ value }: { value: string }) => (
    <span className='relative inline-block h-[1em] w-[0.6em] overflow-hidden'>
        <AnimatePresence initial={false} mode='popLayout'>
            <motion.span
                key={value}
                className='absolute inset-0 flex items-center justify-center'
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                exit={{ y: '-100%' }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
                {value}
            </motion.span>
        </AnimatePresence>
    </span>
);

const Unit = ({ value, label }: { value?: number; label: string }) => {
    const digits = value === undefined ? '--' : String(value).padStart(2, '0');
    return (
        <div className='flex flex-col items-center px-3 sm:px-6 md:px-10'>
            <div className='flex text-5xl sm:text-7xl md:text-8xl font-thin leading-none tabular-nums'>
                {digits.split('').map((d, i) => (
                    <Digit key={digits.length - i} value={d} />
                ))}
            </div>
            <span className='mt-3 text-[10px] md:text-xs uppercase tracking-[0.3em] text-gray-500'>
                {label}
            </span>
        </div>
    );
};

export default function RushCountdown({
    start,
    end,
}: {
    start: string;
    end: string;
}) {
    const target = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    // Undefined until mounted, so server and client render the same markup.
    const [parts, setParts] = useState<Parts | null>();
    const [when, setWhen] = useState('');
    const [over, setOver] = useState(false);

    useEffect(() => {
        setWhen(
            new Date(start).toLocaleString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                timeZone: 'America/Los_Angeles',
            })
        );
        const tick = () => {
            setParts(partsUntil(target));
            setOver(Date.now() >= endTime);
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [start, target, endTime]);

    if (over) return null;

    if (parts === null)
        return (
            <p className='mb-10 text-sm uppercase tracking-[0.35em] text-gray-500'>
                Rush is happening now
            </p>
        );

    return (
        <div className='mb-12'>
            <p className='mb-8 text-xs md:text-sm uppercase tracking-[0.35em] text-gray-500'>
                Rush starts in
            </p>
            <div
                className='flex justify-center divide-x divide-gray-200'
                role='timer'
                aria-label={
                    parts
                        ? `${parts.days} days, ${parts.hours} hours, ${parts.minutes} minutes until rush`
                        : 'Countdown to rush'
                }
            >
                <Unit value={parts?.days} label='Days' />
                <Unit value={parts?.hours} label='Hours' />
                <Unit value={parts?.minutes} label='Min' />
                <Unit value={parts?.seconds} label='Sec' />
            </div>
            <p className='mt-8 h-6 text-base text-gray-600'>{when}</p>
        </div>
    );
}
