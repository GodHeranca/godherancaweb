import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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

type CartItem = Item & { quantity: number };

const SupermarketPage: React.FC<SupermarketPageProps> = ({ name, image, address, categories, items }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const router = useRouter();

    const addToCart = (item: Item) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            } else {
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
    };

    const updateCartItemQuantity = (itemId: number, quantity: number) => {
        setCart((prevCart) =>
            prevCart.map((cartItem) =>
                cartItem.id === itemId
                    ? { ...cartItem, quantity: Math.max(1, quantity) }
                    : cartItem
            )
        );
    };

    const removeFromCart = (itemId: number) => {
        setCart((prevCart) => prevCart.filter((cartItem) => cartItem.id !== itemId));
    };

    const filterItemsByCategoryAndSearch = (): Item[] => {
        let filteredItems = items;
        if (selectedCategory !== null) {
            filteredItems = filteredItems.filter((item) => item.categoryId === selectedCategory);
        }
        if (searchQuery) {
            filteredItems = filteredItems.filter((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return filteredItems;
    };

    const getTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    const finalizePurchase = () => {
        const cartString = JSON.stringify(cart);
        // Using a fixed slug 'order' for simplicity
        router.push(`/checkout/order?cart=${encodeURIComponent(cartString)}`);
    };

    return (
        <div className='flex flex-col lg:flex-row bg-white'>
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

                <div className='mt-4 mb-4'>
                    <input
                        type='text'
                        placeholder='Search for items...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='w-full p-2 border rounded'
                    />
                </div>

                <h2 className='text-2xl font-bold mt-8 mb-4'>Items</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {filterItemsByCategoryAndSearch().map((item) => (
                        <div key={item.id} className='bg-white p-4 rounded shadow'>
                            <Image src={item.image} alt={item.name} width={150} height={150} className='rounded w-full h-auto' />
                            <p className='mt-2 font-bold'>{item.name}</p>
                            <p className='text-gray-600'>{item.description}</p>
                            <p>R${item.price.toFixed(2)}</p>
                            <button
                                onClick={() => addToCart(item)}
                                className='mt-2 px-4 py-2 bg-black text-white rounded'
                            >
                                COMPRAR
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className='w-full lg:w-1/4 bg-white p-4 mt-4 lg:mt-0'>
                <h2 className='text-xl font-bold'>Cart</h2>
                <ul>
                    {cart.map((cartItem, index) => (
                        <li key={index} className='mb-4'>
                            <div className='flex justify-between items-center'>
                                <span>{cartItem.name} - R${cartItem.price.toFixed(2)}</span>
                                <div className='flex items-center'>
                                    <button
                                        onClick={() => updateCartItemQuantity(cartItem.id, cartItem.quantity - 1)}
                                        className='px-2 py-1 bg-gray-300 rounded'
                                    >
                                        -
                                    </button>
                                    <input
                                        type='number'
                                        value={cartItem.quantity}
                                        onChange={(e) => updateCartItemQuantity(cartItem.id, parseInt(e.target.value))}
                                        className='mx-2 w-12 text-center'
                                    />
                                    <button
                                        onClick={() => updateCartItemQuantity(cartItem.id, cartItem.quantity + 1)}
                                        className='px-2 py-1 bg-gray-300 rounded'
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => removeFromCart(cartItem.id)}
                                        className='px-2 py-1 bg-black text-white rounded ml-2'
                                    >
                                        X
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <p className='mt-4 font-bold'>Total: R${getTotal()}</p>
                <button
                    onClick={finalizePurchase}
                    className='mt-4 px-4 py-2 bg-black text-white rounded w-full'
                >
                    Finalizar Comprar
                </button>
            </div>
        </div>
    );
};

export default SupermarketPage;
