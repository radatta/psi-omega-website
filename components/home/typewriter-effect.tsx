'use client';

import { cn } from '@/lib/utils/cn';
import { motion, useAnimate, useInView } from 'motion/react';
import { useEffect, useState } from 'react';

export const TypewriterEffect = ({
    words,
    className,
    cursorClassName,
    delay = 0,
}: {
    words: {
        text: string;
        className?: string;
        pauseAfter?: number;
    }[];
    className?: string;
    cursorClassName?: string;
    delay?: number;
}) => {
    // Create state to control display of text
    const [displayedText, setDisplayedText] = useState('');
    const [scope] = useAnimate();
    const isInView = useInView(scope, { once: true });

    useEffect(() => {
        // Only run the animation when in view (once: true prevents re-triggers)
        if (isInView) {
            // Create a flat array of all characters and their metadata
            const characters: { char: string; pauseAfter?: number }[] = [];

            words.forEach((word, wordIndex) => {
                const chars = [...word.text];

                // Add each character of the word
                chars.forEach((char, charIndex) => {
                    // If this is the last character of a word with pauseAfter, add the pause to this character
                    if (charIndex === chars.length - 1 && word.pauseAfter) {
                        characters.push({ char, pauseAfter: word.pauseAfter });
                    } else {
                        characters.push({ char });
                    }
                });

                // Add space after word (without pause)
                if (wordIndex < words.length - 1) {
                    characters.push({ char: ' ' });
                }
            });

            let charIndex = 0;
            let timer: NodeJS.Timeout;

            // Function to type the next character
            const typeNextChar = () => {
                if (charIndex < characters.length) {
                    const currentChar = characters[charIndex];
                    setDisplayedText((prev) => prev + currentChar.char);
                    charIndex++;

                    // If the character has a pauseAfter property, pause for that duration
                    if (currentChar.pauseAfter) {
                        timer = setTimeout(
                            typeNextChar,
                            currentChar.pauseAfter
                        );
                    } else {
                        timer = setTimeout(typeNextChar, 180); // standard delay
                    }
                }
            };

            // Start the typing after the initial delay
            setTimeout(() => {
                typeNextChar();
            }, delay);

            return () => clearTimeout(timer);
        }
    }, [words, delay, isInView]);

    // Render the displayed text with a cursor
    return (
        <div
            className={cn(
                'text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-center',
                className
            )}
        >
            <div ref={scope}>
                {displayedText}
                <motion.span
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        repeatType: 'reverse',
                    }}
                    className={cn(
                        'inline-block rounded-sm w-[4px] h-4 md:h-6 lg:h-10 bg-blue-500',
                        cursorClassName
                    )}
                ></motion.span>
            </div>
        </div>
    );
};

export const TypewriterEffectSmooth = ({
    words,
    className,
    cursorClassName,
    delay = 0,
}: {
    words: {
        text: string;
        className?: string;
        pauseAfter?: number;
    }[];
    className?: string;
    cursorClassName?: string;
    delay?: number;
}) => {
    // split text inside of words into array of characters
    const wordsArray = words.map((word) => {
        return {
            ...word,
            text: word.text.split(''),
        };
    });
    const renderWords = () => {
        return (
            <div>
                {wordsArray.map((word, idx) => {
                    return (
                        <div key={`word-${idx}`} className='inline-block'>
                            {word.text.map((char, index) => (
                                <span
                                    key={`char-${index}`}
                                    className={cn(
                                        `dark:text-white text-black `,
                                        word.className
                                    )}
                                >
                                    {char}
                                </span>
                            ))}
                            &nbsp;
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className={cn('flex space-x-1 my-6', className)}>
            <motion.div
                className='overflow-hidden pb-2'
                initial={{
                    width: '0%',
                }}
                whileInView={{
                    width: 'fit-content',
                }}
                transition={{
                    duration: 2,
                    ease: 'linear',
                    delay: delay / 1000 + 1, // Convert delay to seconds
                }}
                viewport={{ once: true }} // This ensures the animation only runs once
            >
                <div
                    className='text-xs sm:text-base md:text-xl lg:text:3xl xl:text-5xl font-bold'
                    style={{
                        whiteSpace: 'nowrap',
                    }}
                >
                    {renderWords()}{' '}
                </div>{' '}
            </motion.div>
            <motion.span
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 1,
                }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: 'reverse',
                }}
                className={cn(
                    'block rounded-sm w-[4px]  h-4 sm:h-6 xl:h-12 bg-blue-500',
                    cursorClassName
                )}
            ></motion.span>
        </div>
    );
};
