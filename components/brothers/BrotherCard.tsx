import Image from 'next/image';
import { brotherPhotoPath } from '@/lib/utils/brother-photo';

interface BrotherProps {
    name: string;
    position?: string;
    major?: string;
}

export function BrotherCard({ name, position, major }: BrotherProps) {
    const imageUrl = brotherPhotoPath(name);
    return (
        <div className='flex flex-col items-center'>
            <div className='relative w-72 h-72 mb-4 overflow-hidden'>
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
        </div>
    );
}
