// Played by the home hero and the rush page. New video = new filename (the
// file is cached as immutable); recipe in docs/hero-video.md.
export const rushVideo = '/videos/rush-fall-26-v2.mp4';

export const currentRushData = {
    rushName: 'Fall Rush 2026',
    rushDate: 'September 28th - October 2nd',
    rushWeek: 'Week 2 of Fall Quarter',
    // Countdown (home + rush pages): counts to rushStart, hides after rushEnd.
    // Pacific offset: -07:00 in fall/spring (PDT), -08:00 for winter rush (PST).
    rushStart: '2026-09-28T19:00:00-07:00',
    rushEnd: '2026-10-03T00:00:00-07:00',
    rushFlyer: '/images/rush/rush-flyer.png',
    rushMailingList:
        'https://docs.google.com/forms/d/e/1FAIpQLSeQjXkRljR4H7mXBQkFONaLumUA1GxwwK97maoNceerjRWSzQ/viewform',
    rushApplication: {
        link: 'https://docs.google.com/forms/d/e/1FAIpQLSfbbMGFp-1sXfBL059j8WxMcpqQf5qYRtVuqW8ziQm6QRiQ-w/viewform',
        dueDate: 'September 30th @ 5:00 PM',
    },
};
