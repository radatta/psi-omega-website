'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { ChevronDownIcon } from '@radix-ui/react-icons';

interface FAQItem {
    question: string;
    answer: string | string[];
}

export default function RushFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqItems: FAQItem[] = [
        {
            question:
                'How is Alpha Kappa Psi different from other business organizations?',
            answer: [
                'Alpha Kappa Psi is unique because our brothers come from various majors and backgrounds. While the majority of our brothers are enrolled in the Leavey School of Business, the Psi Omega Chapter also has brothers pursuing engineering, political science, communication, computer science and more!',
                'Our fraternity recognizes the universal nature of business and provides the opportunity for you to develop professional skills that will lead you towards your journey to success, regardless of your career path. During rush and pledging, potential new members will have the opportunity to work in various team settings that showcase your individual strengths while simultaneously connecting you with likeminded brothers that possess the same level of passion and energy as you do.',
            ],
        },
        {
            question: 'What is Rush?',
            answer: 'Rush is a series of events planned by the active chapter for prospective members to learn about our fraternity and for our brothers to meet potential future members. Rush take place two times a year, generally during Week 2 of Fall and Winter quarter. By attending these events, you can see if AKPsi is a good fit for you.',
        },
        {
            question: 'Why Rush?',
            answer: 'As one of the two business fraternities on campus, AKPsi offers much more than professional development. Looking at our five core values, we strive to meet the balance between both professional and social development. Our brothers are highly accomplished students who are motivated to do more, to achieve more. Our alumni go on to rewarding and exciting careers by utilizing the resources that AKPsi provides to help individuals reach their full potential. We also recognize that business talent comes from all majors, and our openness to students of all different backgrounds and majors is one of our greatest strengths. We invite you to learn more about us and we look forward to meeting you.',
        },
        {
            question: 'How can I prepare for rush?',
            answer: 'Alpha Kappa Psi will begin recruitment over the next few weeks leading up to Rush. For those interested in joining, we encourage attending as many of these events as possible to become familiar with the the brothers. Some of these events include: info sessions, virtual coffee chats, and professional workshops.',
        },
        {
            question: 'What are the qualifications to join AKPsi?',
            answer: 'Must be an undergraduate student enrolled in the Leavey School of Business, College of Arts and Sciences, or School of Engineering at Santa Clara University with a minimum GPA of 2.0',
        },
        {
            question: 'If AKPsi is a fraternity, why is it co-ed?',
            answer: "Alpha Kappa Psi was founded as an all male fraternity in 1904, with one of their biggest objectives being to help set up business schools at universities. The Federal Government was more than happy to provide financial assistance to AKPsi's mission. In 1976, with the passage of the Equal Rights in Education Act, AKPsi welcomed strong, business-minded women into the fraternity.",
        },
        {
            question:
                'Do you have to attend all Rush events in order to qualify for membership?',
            answer: 'While it is not a requirement to attend all events, we highly recommend prospective members to attend as many events as possible. If you are unable to attend an event for any reason, please feel free to email us. It is difficult to thoroughly know each prospective member given the large number of applicants, so every moment in which we interact with you helps to make for a much more accurate decision process. Quality time leads to quality decisions that result in quality members.',
        },
        {
            question: 'Who does AKPsi look for?',
            answer: 'There is no specific type of person that AKPsi looks for, because we recognize that each individual has different strengths. However, our expectations are no different than those from any professional organization- we expect prospective members to be bright and motivated individuals who work well with others. Every individual that is given a bid earns it based on individual merits, and we look for potential just as much as present qualities.',
        },
        {
            question: 'What is a "bid" and how do I receive one?',
            answer: 'A bid is an invitation to participate in the pledge process in preparation to joining our fraternity. To receive a bid, the vast majority of the active brothers must vote favorably for your admittance to become a pledge. In order to have our members vote favorably on your behalf, it is important that they have had the opportunity to meet and get to know you. It is therefore recommended to attend as many Rush events as possible.',
        },
        {
            question: "If I don't receive a bid, can I rush again?",
            answer: 'Rushing multiple times is allowed and even encouraged if one is dedicated to joining AKPsi. We understand that there are several factors to be considered, so there is absolutely no penalty for coming another time. In fact, many members in AKPsi have rushed more than once.',
        },
        {
            question: 'What is a "pledge?"',
            answer: 'A pledge is potential member who has accepted their bid and undergone a ritual conducted by the fraternity. It is a promise made by the individual to strive to become a full member of the Brotherhood.',
        },
        {
            question: 'Is there a pledge period?',
            answer: [
                'Yes, if the individual is extended a bid and chooses to accept, he/she, along with their pledge class, will have to complete a series of events and tasks that are designed to foster a better understanding of the fraternity, brotherhood, and professional development. Our pledge process is a six-week course designed to challenge and test individuals, pushing them toward their full potential. Some tasks expected to be completed include hosting a professional, service, and social event. Pledges will meet a fundraising goal and learn about the history of Alpha Kappa Psi as well as the Psi Omega chapter. There will be opportunities to meet and bond with fellow pledge brothers as well as the active brothers of the fraternity.',
                '.',
            ],
        },
        {
            question: 'Does AKPsi haze during the pledge process?',
            answer: 'No, Alpha Kappa Psi has strict policies against hazing. All pledge and active brother events are designed to build teamwork, trust, professional development, creativity, and brotherhood.',
        },
    ];

    return (
        <div className='space-y-4'>
            {faqItems.map((item, index) => (
                <div
                    key={index}
                    className='border border-gray-200 rounded-lg overflow-hidden'
                >
                    <button
                        className='flex justify-between items-center w-full p-4 text-left bg-white hover:bg-gray-50 transition-colors'
                        onClick={() => toggleFAQ(index)}
                    >
                        <h3 className='text-lg font-semibold'>
                            {item.question}
                        </h3>
                        <ChevronDownIcon
                            className={cn(
                                'h-5 w-5 text-gray-500 transition-transform duration-200',
                                openIndex === index
                                    ? 'transform rotate-180'
                                    : ''
                            )}
                        />
                    </button>

                    <div
                        className={cn(
                            'overflow-hidden transition-all duration-300 ease-in-out bg-gray-50',
                            openIndex === index
                                ? 'max-h-[1000px] p-4'
                                : 'max-h-0'
                        )}
                    >
                        {Array.isArray(item.answer) ? (
                            item.answer.map((paragraph, i) => (
                                <p
                                    key={i}
                                    className={
                                        i < item.answer.length - 1 ? 'mb-4' : ''
                                    }
                                >
                                    {paragraph}
                                </p>
                            ))
                        ) : (
                            <p>{item.answer}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
