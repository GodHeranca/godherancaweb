import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';

// Create an instance of axios with a base URL
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL
});

// Interfaces matching your Mongoose models
export interface Category {
    _id: string;
    name: string;
    image?: string;
    userId?: string;
    supermarketId?: string;
    parentCategory?: string; // Field for parent category ID
    subcategories?: { _id: string; name: string }[];
}

export interface QuantityOffer {
    quantity: number;
    price: number;
}

export interface Item {
    _id: string;
    category: string;
    name: string;
    image: string;
    price: number;
    description?: string; // Make description optional
    weight: number; // Ensure this matches your data type
    unit: string; // Ensure this matches your data type
    discount?: number;
    promotionEnd?: Date;
    stockQuantity: number;
    supermarket?: string;
    quantity: number;
    quantityOffers?: QuantityOffer[];
}

export interface Supermarket {
    _id: string;
    name: string;
    image?: string;
    address: string;
    categories?: Category[]; // Change this from number[] to Category[]
    items?: Item[]; // Change this from string[] to Item[]
}

interface SupermarketContextType {
    supermarkets: Supermarket[];
    categories: Category[];
    items: Item[];
    loading: boolean;
    error: string | null;
    fetchSupermarketDetails: (id: string) => void;
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    setItems: React.Dispatch<React.SetStateAction<Item[]>>;
}


const SupermarketContext = createContext<SupermarketContextType | undefined>(undefined);

export const SupermarketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch supermarkets
    useEffect(() => {
        const fetchSupermarkets = async () => {
            try {
                const response = await api.get('/supermarket');
                setSupermarkets(response.data);
            } catch (err) {
                console.error('Error fetching supermarkets:', err);
                setError('Failed to fetch supermarkets');
            } finally {
                setLoading(false);
            }
        };

        fetchSupermarkets();
    }, []);

  // Fetch categories and items for a specific supermarket
    const fetchSupermarketDetails = async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            const [categoriesResponse, itemsResponse] = await Promise.all([
                api.get(`/supermarket/${id}/categories`),
                api.get(`/supermarket/${id}/items`)
            ]);

            console.log('Fetched Categories:', categoriesResponse.data);
            console.log('Fetched Items:', itemsResponse.data);

            setCategories(categoriesResponse.data);
            setItems(itemsResponse.data);
        } catch (err) {
            console.error('Error fetching categories or items:', err);
            setError('Failed to fetch categories or items');
        } finally {
            setLoading(false);
        }
    };



    return (
        <SupermarketContext.Provider value={{ supermarkets, categories, items, loading, error, fetchSupermarketDetails, setCategories, setItems }}>
            {children}
        </SupermarketContext.Provider>
    );
};


export const useSupermarkets = () => {
    const context = useContext(SupermarketContext);
    if (!context) {
        throw new Error('useSupermarkets must be used within a SupermarketProvider');
    }
    return context;
};
