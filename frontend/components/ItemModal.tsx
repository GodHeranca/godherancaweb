import React, { useState } from 'react';
import Image from 'next/legacy/image';
import { Item } from '../context/SupermarketContext';

interface ItemModalProps {
    item: Item | null;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (item: Item) => void;
}

const ItemModal: React.FC<ItemModalProps> = ({ item, isOpen, onClose, onAddToCart }) => {
    const [buttonClicked, setButtonClicked] = useState(false);

    if (!isOpen || !item) return null;

    const handleButtonClick = () => {
        onAddToCart(item);
        setButtonClicked(true);
        setTimeout(() => setButtonClicked(false), 200);
    };

    const getPrice = () => {
        if (item.discount) {
            return (item.price * (1 - item.discount / 100)).toFixed(2);
        }
        return item.price.toFixed(2);
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
            <div
                className='bg-white p-6 rounded-lg shadow-lg relative w-full max-w-lg'
                onClick={(e) => e.stopPropagation()} // Prevent clicks from closing modal
            >
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent click event from propagating
                        onClose(); // Trigger close function
                    }}
                    className='absolute top-2 right-2 p-2 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none focus:ring'
                    aria-label='Close'
                >
                    <Image src='/close.svg' alt='close' width={24} height={24} />
                </button>
                <div className='flex flex-col items-center'>
                    <div className='w-full h-40 relative mb-4'>
                        <Image
                            src={item.image}
                            alt={item.name}
                            layout='fill'
                            objectFit='contain'
                            className='rounded-lg'
                            priority
                            sizes="(max-width: 768px) 100vw, 
           (max-width: 1200px) 50vw, 
           33vw"
                        />
                    </div>
                    <h2 className='mt-2 text-xl font-bold text-center'>{item.name}</h2>
                    <p className='text-gray-600 text-center mt-2'>{item.description}</p>
                    <p className='text-lg font-semibold mt-2'>
                        R${item.discount ? (
                            <>
                                <span className='line-through text-gray-500 mr-2'>{item.price.toFixed(2)}</span>
                                <span className='text-red-500'>{getPrice()}</span>
                            </>
                        ) : (
                            item.price.toFixed(2)
                        )}
                    </p>
                    <p className='text-gray-600 text-center mt-2'>{item.weight} {item.unit}</p>
                    <button
                        onClick={handleButtonClick}
                        className={`mt-4 px-4 py-2 rounded-lg transition-transform duration-200 ease-in-out text-sm font-semibold ${buttonClicked ? 'bg-black text-white scale-95' : 'bg-gray-500 text-white'}`}
                    >
                        COMPRAR
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ItemModal;
