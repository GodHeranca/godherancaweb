import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Item } from '@/data/supermarketType'; // Import the Item type

interface ItemCardProps {
    item: Item;
    onAddToCart: (item: Item) => void;
    onClick?: () => void; // Make onClick optional
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onAddToCart, onClick }) => {
    const [buttonClicked, setButtonClicked] = useState(false);
    const [imageClicked, setImageClicked] = useState(false);
    const [timeLeft, setTimeLeft] = useState<string | null>(null);

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation(); // Prevent the click event from bubbling up
        onAddToCart(item);
        setButtonClicked(true);
        setTimeout(() => setButtonClicked(false), 200); // Reset the button state after 200ms
    };

    const isPromotionActive = item.discount !== undefined && item.promotionEnd !== undefined && new Date() < new Date(item.promotionEnd);
    const discountedPrice = isPromotionActive ? item.price * (1 - (item.discount ?? 0) / 100) : item.price;

    useEffect(() => {
        if (!isPromotionActive) return;

        const updateCountdown = () => {
            const now = new Date();
            const timeDiff = new Date(item.promotionEnd!).getTime() - now.getTime();
            if (timeDiff <= 0) {
                setTimeLeft(null);
                return;
            }

            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        };

        const timerId = setInterval(updateCountdown, 1000);
        updateCountdown();

        return () => clearInterval(timerId);
    }, [item.promotionEnd, isPromotionActive]);

    return (
        <div
            className='bg-white p-2 rounded shadow cursor-pointer transition-transform transform hover:scale-105 border border-gray-600'
            onClick={() => {
                if (onClick) onClick();
                setImageClicked(true);
            }}
            style={{ width: '180px' }} // Adjusted width for portability
        >
            <Image
                src={item.image}
                alt={item.name}
                width={150}
                height={70}
                className={`rounded transition-transform duration-300 ${imageClicked ? 'scale-105' : ''}`}
            />
            <p className='mt-2 font-bold text-sm'>{item.name}</p>
            <p className='text-gray-600 text-xs'>{item.description}</p>
            <p className='text-gray-800 text-xs'>{item.weight}{item.unit}</p> {/* Added weight and unit */}
            {isPromotionActive ? (
                <>
                    <p className='text-red-600 line-through text-xs'>R${item.price.toFixed(2)}</p>
                    <p className='text-green-600 font-bold text-sm'>R${discountedPrice.toFixed(2)}</p>
                    {timeLeft && <p className='text-red-500 text-xs'>Promo ends in: {timeLeft}</p>}
                </>
            ) : (
                <p className='text-sm'>R${item.price.toFixed(2)}</p>
            )}
            <button
                onClick={handleButtonClick}
                className={`mt-2 px-2 py-1 rounded transition-transform duration-200 ease-in-out text-xs font-semibold ${buttonClicked ? 'bg-black text-white scale-95' : 'bg-gray-500 text-white'
                    }`}
            >
                COMPRAR
            </button>
        </div>
    );
};

export default ItemCard;
