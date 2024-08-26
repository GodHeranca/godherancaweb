import React from 'react';
import { Category } from '@/context/SupermarketContext';
import Image from 'next/legacy/image';

interface SubcategoriesModalProps {
    isOpen: boolean;
    onClose: () => void;
    subcategories: Category[];
}

const SubcategoriesModal: React.FC<SubcategoriesModalProps> = ({ isOpen, onClose, subcategories }) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50'>
            <div className='bg-white p-6 rounded-lg w-80'>
                <h2 className='text-xl font-bold mb-4'>Subcategories</h2>
                <button
                    onClick={onClose}
                    className='absolute top-2 right-2 text-gray-500 hover:text-gray-800'
                >
                    &times;
                </button>
                <div className='flex flex-col space-y-4'>
                    {subcategories.map(subcategory => (
                        <button
                            key={subcategory._id}
                            className='flex flex-col items-center p-4 bg-white text-black rounded-md transition-colors duration-300 ease-in-out transform hover:scale-105'
                            onClick={() => {
                                // Handle subcategory click here
                                console.log(`Clicked on subcategory: ${subcategory.name}`);
                                // Possibly trigger another action or navigate to subcategory items
                            }}
                        >
                            <div className='relative w-12 h-12 mb-2'>
                                <Image
                                    src={subcategory.image || '/default-category-image.jpg'}
                                    alt={subcategory.name}
                                    layout='fill'
                                    objectFit='contain'
                                    className='rounded-2xl'
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                            <span className='text-sm font-medium text-center'>{subcategory.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubcategoriesModal;
