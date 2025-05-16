import Image from 'next/image';

interface BrotherProps {
    name: string;
    position?: string;
    major?: string;
    linkedin?: string;
}

export function BrotherCard({ name, position, major, linkedin }: BrotherProps) {
    const imageUrl = `/images/brothers/${name
        .split(' ')
        .map((part, index) =>
            index === 0 ? part : part.charAt(0) + part.slice(1)
        )
        .join('-')}.jpg`;
    return (
        <div className='flex flex-col items-center'>
            <div className='relative w-64 h-64 mb-4 rounded-full overflow-hidden'>
                <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className='object-cover'
                />
            </div>
            <h3 className='text-xl font-bold text-center'>{name}</h3>
            {position && (
                <p className='text-center text-gray-700'>{position}</p>
            )}
            {major && <p className='text-center text-gray-700'>{major}</p>}
            {linkedin && (
                <a
                    href={linkedin}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='mt-2 text-blue-600 hover:underline'
                >
                    LinkedIn
                </a>
            )}
        </div>
    );
}
