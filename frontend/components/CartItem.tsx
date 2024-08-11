import React from 'react';
import Image from 'next/image';

type CartItemProps = {
    cartItem: {
        id: number;
        name: string;
        price: number;
        quantity: number;
        image: string;
        discount?: number; // Add discount property
    };
    onQuantityChange: (id: number, quantity: number) => void;
    onRemove: (id: number) => void;
};

const CartItem: React.FC<CartItemProps> = ({ cartItem, onQuantityChange, onRemove }) => {
    const discountedPrice = cartItem.discount ? cartItem.price * (1 - cartItem.discount / 100) : cartItem.price;
    const totalPrice = discountedPrice * cartItem.quantity;

    return (
        <li className='mb-4 flex flex-col sm:flex-row justify-between items-center p-2 border-b border-gray-200'>
            <div className='flex items-center mb-2 sm:mb-0'>
                <Image src={cartItem.image} alt={cartItem.name} width={50} height={50} className='rounded' />
                <div className='ml-4'>
                    <span className='block text-lg font-semibold'>{cartItem.name}</span>
                    <span className='block text-sm text-gray-500'>R${totalPrice.toFixed(2)}</span>
                </div>
            </div>
            <div className='flex items-center'>
                <button
                    onClick={() => onQuantityChange(cartItem.id, cartItem.quantity - 1)}
                    className='px-3 py-1 bg-gray-600 rounded-l-lg hover:bg-black transition text-white'
                    aria-label='Decrease quantity'
                >
                    -
                </button>
                <span className='px-4 py-1 border-t border-b border-gray-300 text-center w-12'>{cartItem.quantity}</span>
                <button
                    onClick={() => onQuantityChange(cartItem.id, cartItem.quantity + 1)}
                    className='px-3 py-1 bg-gray-600 rounded-r-lg hover:bg-black transition text-white'
                    aria-label='Increase quantity'
                >
                    +
                </button>
                <button
                    onClick={() => onRemove(cartItem.id)}
                    className='px-3 py-1 ml-2 bg-white rounded hover:bg-gray-600 transition'
                    aria-label='Remove item'
                >
                    <Image src='/delete.svg' alt='Delete' width={50} height={50} />
                </button>
            </div>
        </li>
    );
};

export default CartItem;
