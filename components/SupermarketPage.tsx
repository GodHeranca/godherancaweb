import React, { useState } from 'react';
import Image from 'next/image';

type Category = {
    id: number;
    name: string;
    image: string;
};

type Item = {
    id: number;
    categoryId: number;
    name: string;
    image: string;
    price: number;
    description: string;
};

interface SupermarketPageProps {
    name: string;
    image: string;
    address: string;
    categories: Category[];
    items: Item[];
}

const SupermarketPage: React.FC<SupermarketPageProps> = ({ name, image, address, categories, items }) => {
    const [cart, setCart] = useState<Item[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    const addToCart = (item: Item) => {
        setCart([...cart, item]);
    };

    const filterItemsByCategory = (categoryId: number | null): Item[] => {
        if (categoryId === null) {
            return items;
        }
        return items.filter((item) => item.categoryId === categoryId);
    };

    return (
        <div className='flex flex-col lg:flex-row'>
            <div className='w-full lg:w-3/4 p-4'>
                <Image src={image} alt={name} width={800} height={300} className='rounded-2xl w-full h-auto' />
                <h2 className='text-2xl font-bold mt-4 mb-4'>{name}</h2>
                <p className='text-lg text-gray-600 mb-4'>{address}</p>
                <h2 className='text-2xl font-bold mb-4'>Categorias</h2>
                <div className='flex flex-wrap space-x-4 overflow-x-auto'>
                    <button onClick={() => setSelectedCategory(null)} className='flex flex-col items-center px-4 py-2 bg-white text-black rounded mb-4'>
                        <Image src="/all.svg" alt="All" width={50} height={50} className='rounded py-2' />
                        Todos
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className='flex flex-col items-center px-4 py-2 bg-white text-black rounded mb-4'
                        >
                            <Image src={category.image} alt={category.name} width={50} height={50} className='rounded py-2' />
                            {category.name}
                        </button>
                    ))}
                </div>

                <h2 className='text-2xl font-bold mt-8 mb-4'>Items</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {filterItemsByCategory(selectedCategory).map((item) => (
                        <div key={item.id} className='bg-white p-4 rounded shadow'>
                            <Image src={item.image} alt={item.name} width={150} height={150} className='rounded w-full h-auto' />
                            <p className='mt-2 font-bold'>{item.name}</p>
                            <p className='text-gray-600'>{item.description}</p>
                            <p>R${item.price.toFixed(2)}</p>
                            <button
                                onClick={() => addToCart(item)}
                                className='mt-2 px-4 py-2 bg-black text-white rounded'
                            >
                                Adicionar ao Carrinho
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className='w-full lg:w-1/4 bg-gray-100 p-4 mt-4 lg:mt-0'>
                <h2 className='text-xl font-bold'>Cart</h2>
                <ul>
                    {cart.map((item, index) => (
                        <li key={index} className='mb-2'>
                            {item.name} - R${item.price.toFixed(2)}
                        </li>
                    ))}
                </ul>
                <p className='mt-4 font-bold'>Total: R${cart.reduce((total, item) => total + item.price, 0).toFixed(2)}</p>
            </div>
        </div>
    );
};

export default SupermarketPage;
