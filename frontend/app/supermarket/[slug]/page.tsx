"use client"
import { useSearchParams } from 'next/navigation';
import SupermarketPage from '@/components/SupermarketPage';

const supermarket = () => {
    const searchParams = useSearchParams();
    const name = searchParams.get('name');
    const image = searchParams.get('image');
    const address = searchParams.get('address');
    const categories = JSON.parse(searchParams.get('categories') || '[]');
    const items = JSON.parse(searchParams.get('items') || '[]');

    if (!name || !image || !address) {
        return <p>Loading...</p>;
    }

    return (
        <SupermarketPage
            name={name}
            image={image}
            address={address}
            categories={categories}
            items={items}
        />
    );
};

export default supermarket;
