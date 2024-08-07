import React, { useState } from 'react';
import Image from 'next/image';
import { Item } from '@/data/type'; // Import the Item type

interface ItemCardProps {
    item: Item;
    onAddToCart: (item: Item) => void;
    onClick?: () => void; // Make onClick optional
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onAddToCart, onClick }) => {
    const [buttonClicked, setButtonClicked] = useState(false);
    const [imageClicked, setImageClicked] = useState(false);

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation(); // Prevent the click event from bubbling up
        onAddToCart(item);
        setButtonClicked(true);
        setTimeout(() => setButtonClicked(false), 200); // Reset the button state after 200ms
    };

    return (
        <div
            className='bg-white p-4 rounded shadow cursor-pointer'
            onClick={() => {
                if (onClick) onClick();
                setImageClicked(true);
            }}
        >
            <Image
                src={item.image}
                alt={item.name}
                width={150}
                height={70}
                className={`rounded w-full h-auto transition-transform ${imageClicked ? 'transform scale-105' : ''}`}
            />
            <p className='mt-2 font-bold'>{item.name}</p>
            <p className='text-gray-600'>{item.description}</p>
            <p>R${item.price.toFixed(2)}</p>
            <button
                onClick={handleButtonClick}
                className={`mt-2 px-4 py-2 rounded-xl transition-transform duration-200 ease-in-out ${buttonClicked ? 'bg-black text-white scale-95' : 'bg-gray-500 text-white'
                    }`}
            >
                COMPRAR
            </button>
        </div>
    );
};

export default ItemCard;
