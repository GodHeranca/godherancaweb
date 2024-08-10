import React, { useState } from 'react';
import Image from 'next/image';
import { Item } from '@/data/supermarketType';

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
        setTimeout(() => setButtonClicked(false), 200); // Reset the button state after 200ms
    };

    const getPrice = () => {
        if (item.discount) {
            return (item.price * (1 - item.discount / 100)).toFixed(2);
        }
        return item.price.toFixed(2);
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='bg-white p-6 rounded-lg shadow-lg relative max-w-lg w-full'>
                <button
                    onClick={onClose}
                    className='absolute top-2 right-2'
                    aria-label='Close'
                >
                    <Image src='/close.svg' alt='close' width={30} height={30} />
                </button>
                <div className='flex flex-col items-center'>
                    <Image src={item.image} alt={item.name} width={150} height={150} className='rounded' />
                    <h2 className='mt-4 text-2xl font-bold text-center'>{item.name}</h2>
                    <p className='text-gray-600 text-center mt-2'>{item.description}</p>
                    <p className='text-lg font-semibold mt-2'>
                        R$
                        {item.discount ? (
                            <>
                                <span className='line-through mr-2'>{item.price.toFixed(2)}</span>
                                <span className='text-red-500'>{getPrice()}</span>
                            </>
                        ) : (
                            item.price.toFixed(2)
                        )}
                    </p>
                    <p className='text-gray-600 text-center mt-2'>{item.weight} {item.unit}</p>
                    <button
                        onClick={handleButtonClick}
                        className={`mt-4 px-6 py-2 rounded-lg transition-transform duration-200 ease-in-out ${buttonClicked ? 'bg-black text-white scale-95' : 'bg-gray-500 text-white'
                            }`}
                    >
                        COMPRAR
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ItemModal;
