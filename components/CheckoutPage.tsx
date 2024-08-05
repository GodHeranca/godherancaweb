'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type CartItem = {
    id: number;
    categoryId: number;
    name: string;
    image: string;
    price: number;
    description: string;
    quantity: number;
};

const CheckoutPage = () => {
    const searchParams = useSearchParams();
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        const cartString = searchParams.get('cart');
        if (cartString) {
            setCart(JSON.parse(cartString));
        }
    }, [searchParams]);

    return (
        <div className='p-4'>
            <h1 className='text-2xl font-bold mb-4'>Checkout</h1>
            <ul>
                {cart.map((item, index) => (
                    <li key={index} className='mb-4'>
                        {item.name} - R${item.price.toFixed(2)} x {item.quantity}
                    </li>
                ))}
            </ul>
            <p className='mt-4 font-bold'>
                Total: R${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
            </p>
        </div>
    );
};

export default CheckoutPage;
