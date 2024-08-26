import React, { useState, useEffect } from 'react';
import Image from 'next/legacy/image';
import { Item } from '../context/SupermarketContext';

interface ItemCardProps {
    item: Item;
    onAddToCart: (item: Item) => void;
    onClick?: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onAddToCart, onClick }) => {
    const [buttonClicked, setButtonClicked] = useState(false);
    const [imageClicked, setImageClicked] = useState(false);
    const [timeLeft, setTimeLeft] = useState<string | null>(null);

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        onAddToCart(item);
        setButtonClicked(true);
        setTimeout(() => setButtonClicked(false), 200);
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
            className='bg-white p-2 rounded shadow cursor-pointer transition-transform transform hover:scale-105 border border-gray-200 sm:w-full md:w-60 lg:w-48 xl:w-40'
            onClick={() => {
                if (onClick) onClick();
                setImageClicked(true);
            }}
        >
            <div className="relative w-full h-32 mb-2"> {/* Adjusted height */}
                <div className="relative w-full h-full">
                    <Image
                        src={item.image}
                        alt={item.name}
                        layout="fill"
                        objectFit='contain'
                        priority={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={`rounded transition-transform duration-300 ${imageClicked ? 'scale-105' : ''}`}
                    />
                </div>
            </div>
            <p className='mt-2 font-bold text-sm md:text-base'>{item.name}</p>
            <p className='text-gray-600 text-xs md:text-sm'>{item.description}</p>
            <p className='text-gray-800 text-xs md:text-sm'>{item.weight}{item.unit}</p>
            {isPromotionActive ? (
                <>
                    <p className='text-red-600 line-through text-xs md:text-sm'>R${item.price.toFixed(2)}</p>
                    <p className='text-green-600 font-bold text-sm md:text-base'>R${discountedPrice.toFixed(2)}</p>
                    {timeLeft && <p className='text-red-500 text-xs md:text-sm'>Promo ends in: {timeLeft}</p>}
                </>
            ) : (
                <p className='text-sm md:text-base'>R${item.price.toFixed(2)}</p>
            )}

            {/* Display quantity offers */}
            {item.quantityOffers && item.quantityOffers.length > 0 && (
                <div className='mt-2'>
                    <h3 className='font-semibold text-sm'>Offers:</h3>
                    <ul className='list-disc list-inside text-xs md:text-sm'>
                        {item.quantityOffers.map((offer, index) => (
                            <li key={index}>
                                Buy {offer.quantity} for R${offer.price.toFixed(2)} each
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <button
                onClick={handleButtonClick}
                className={`mt-2 px-2 py-1 rounded transition-transform duration-200 ease-in-out text-xs font-semibold ${buttonClicked ? 'bg-black text-white scale-95' : 'bg-gray-600 text-white'}`}
            >
                COMPRAR
            </button>
        </div>
    );
};

export default ItemCard;
