import React, { useState } from 'react';
import Image from 'next/legacy/image';

interface Subcategory {
    _id: string;
    name: string;
}

interface Category {
    _id: string;
    name: string;
    image?: string;
    subcategories?: Subcategory[];
}

interface CategoryButtonProps {
    category: Category;
    onClick: () => void;
    onSubcategoryClick: (subcategoryId: string) => void;
    isSelected: boolean;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ category, onClick, onSubcategoryClick, isSelected }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative flex flex-col items-center"
        >
            <button
                onClick={onClick}
                className={`flex flex-col items-center px-4 py-2 ${isSelected ? 'bg-gray-200' : 'bg-white'} text-black rounded transition-all duration-300`}
            >
                <div className='relative w-16 h-16 mb-2'>
                    <Image
                        src={category.image || '/default-category.jpg'}
                        alt={category.name}
                        layout="fill"
                        objectFit='cover'
                        className='rounded-full'
                    />
                </div>
                {category.name}
            </button>

            {isHovered && category.subcategories && category.subcategories.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-2xl rounded-lg overflow-y-auto z-50 max-h-screen">
                    <div className="p-4">
                        {category.subcategories.map(subcategory => (
                            <button
                                key={subcategory._id}
                                onClick={() => onSubcategoryClick(subcategory._id)}
                                className="block px-6 py-3 text-left w-full hover:bg-gray-200 rounded transition-all duration-300"
                            >
                                {subcategory.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryButton;
