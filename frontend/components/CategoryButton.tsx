import React from 'react';
import Image from 'next/image';

type Category = {
    id: number;
    name: string;
    image: string;
};

interface CategoryButtonProps {
    category: Category;
    onClick: (categoryId: number | null) => void;
    isSelected: boolean;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ category, onClick, isSelected }) => {
    return (
        <button
            onClick={() => onClick(category.id)}
            className={`flex flex-col items-center px-4 py-2 ${isSelected ? 'bg-gray-300' : 'bg-white'} text-black rounded mb-4`}
        >
            <Image src={category.image} alt={category.name} width={50} height={50} className='rounded py-2' />
            {category.name}
        </button>
    );
};

export default CategoryButton;
