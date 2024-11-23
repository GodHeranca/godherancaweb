// components/ItemDetail.tsx
import React from 'react';
import Image from 'next/image';
import { Item } from '@/data/supermarketType'; // Import the Item type

interface ItemDetailProps {
    item: Item;
}

const ItemDetail: React.FC<ItemDetailProps> = ({ item }) => {
    return (
        <div className='bg-white p-4 rounded shadow'>
            <Image src={item.image} alt={item.name} width={300} height={300} className='rounded w-full h-auto' />
            <h2 className='text-2xl font-bold mt-4 mb-4'>{item.name}</h2>
            <p className='text-lg text-gray-600 mb-4'>{item.description}</p>
            <p className='text-lg font-bold'>R${item.price.toFixed(2)}</p>
            <p className='text-lg text-gray-600'>Weight: {item.weight} kg</p>
        </div>
    );
};

export default ItemDetail;
