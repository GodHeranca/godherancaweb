import React from 'react';
import Image from 'next/legacy/image';
import { Item } from '@/context/SupermarketContext';

interface CartItemProps {
    item: Item; // Single item, not an array
    onQuantityChange: (id: string, quantity: number) => void;
    onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onQuantityChange, onRemove }) => {
    // Calculate the discounted price
    const discountedPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price;

    // Determine the final price based on quantity offers
    const getFinalPrice = (quantity: number): number => {
        if (item.quantityOffers) {
            // Sort offers by quantity in descending order
            const sortedOffers = item.quantityOffers.sort((a, b) => b.quantity - a.quantity);
            // Find the applicable offer
            for (const offer of sortedOffers) {
                if (quantity >= offer.quantity) {
                    return offer.price;
                }
            }
        }
        // No applicable offer, return discounted price
        return discountedPrice;
    };

    const finalPrice = getFinalPrice(item.quantity);
    const totalPrice = finalPrice * item.quantity;

    return (
        <li className='mb-4 flex flex-col sm:flex-row justify-between items-center p-2 border-b border-gray-200'>
            <div className='flex items-center mb-2 sm:mb-0'>
                <div className='w-12 h-12 relative'> {/* Added wrapper div */}
                    <Image
                        src={item.image}
                        alt={item.name}
                        layout="fill"
                        objectFit="cover"
                        className='rounded'
                        priority
                        sizes="(max-width: 768px) 100vw, 
                               (max-width: 1200px) 50vw, 
                               33vw"
                    />
                </div>
                <div className='ml-4'>
                    <span className='block text-lg font-semibold'>{item.name}</span>
                    <span className='block text-sm text-gray-500'>R${totalPrice.toFixed(2)}</span>
                </div>
            </div>
            <div className='flex items-center mt-2 sm:mt-0'>
                <button
                    onClick={() => onQuantityChange(item._id, item.quantity - 1)}
                    className='px-2 py-1 bg-gray-600 rounded-l-lg hover:bg-black transition text-white text-xs sm:text-sm'
                    aria-label='Decrease quantity by 1'
                >
                    -
                </button>
                <span className='px-3 py-1 border-t border-b border-gray-300 text-center w-12 text-xs sm:text-sm'>
                    {item.quantity}
                </span>
                <button
                    onClick={() => onQuantityChange(item._id, item.quantity + 1)}
                    className='px-2 py-1 bg-gray-600 rounded-r-lg hover:bg-black transition text-white text-xs sm:text-sm'
                    aria-label='Increase quantity by 1'
                >
                    +
                </button>
                <button
                    onClick={() => onRemove(item._id)}
                    className='px-2 py-1 ml-2 bg-white rounded hover:bg-gray-600 transition'
                    aria-label='Remove item from cart'
                >
                    <Image src='/delete.svg' alt='Delete' width={20} height={20} />
                </button>
            </div>
        </li>
    );
};

export default CartItem;