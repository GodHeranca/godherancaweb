import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { useLogin } from './LoginContext';
import { useSupermarket } from './SupermarketContext';

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
    discountedPrice?: number; // Make this optional
    description: string;
    weight: number;
    stockQuantity: number;
    unit: string;
    discount?: number; // This is possibly undefined
    promotionEnd?: Date; // This is possibly undefined
    supermarket: string;
    quantityOffers?: QuantityOffer[]; // New property for quantity offers
}

interface ItemContextType {
    items: Item[];
    createItem: (item: Partial<Item>, image: File) => Promise<void>;
    fetchItemById: (id: string) => Promise<Item | null>;
    fetchItemsBySupermarket: () => Promise<Item[]>;
    fetchItemsByCategory: (categoryId: string) => Promise<Item[]>;
    updateItem: (id: string, updatedItem: Partial<Item>, image?: File) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
}

const ItemContext = createContext<ItemContextType | undefined>(undefined);

export const ItemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<Item[]>([]);
    const { user, isAuthenticated } = useLogin();
    const { supermarketId } = useSupermarket();

    useEffect(() => {
        if (isAuthenticated && supermarketId) {
            fetchItemsBySupermarket();
        }
    }, [isAuthenticated, supermarketId]);

    const createItem = async (item: Partial<Item>, image: File) => {
        if (!user || !isAuthenticated) {
            console.error('User is not authenticated');
            return;
        }

        try {
            const formData = new FormData();
            Object.keys(item).forEach((key) => {
                const value = item[key as keyof Item];
                if (value !== undefined) {
                    if (key === 'promotionEnd' && value instanceof Date) {
                        formData.append(key, value.toISOString());
                    } else if (key === 'quantityOffers') {
                        formData.append(key, JSON.stringify(value)); // Stringify quantityOffers array
                    } else {
                        formData.append(key, value as string | Blob);
                    }
                }
            });

            if (image) {
                formData.append('imageUrl', image);
            }

            await axios.post<Item>(`http://localhost:8080/item/${supermarketId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${user?._id}`,
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                },
                withCredentials: true,
            });

            fetchItemsBySupermarket();
        } catch (error) {
            console.error('Error creating item:', error);
        }
    };


    const fetchItemById = async (id: string): Promise<Item | null> => {
        try {
            const response = await axios.get<Item>(`http://localhost:8080/item/${id}`, {
                headers: {
                    Authorization: `Bearer ${user?._id}`,
                },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching item by ID:', error);
            return null;
        }
    };

    const fetchItemsBySupermarket = async (): Promise<Item[]> => {
        if (!supermarketId) {
            console.error('Supermarket ID is not available');
            return [];
        }

        try {
            const response = await axios.get<Item[]>(`http://localhost:8080/supermarket/${supermarketId}/items`, {
                headers: {
                    'Authorization': `Bearer ${user?._id}`,
                },
                withCredentials: true,
            });
            setItems(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching items by supermarket:', error);
            return [];
        }
    };

    const fetchItemsByCategory = async (categoryId: string): Promise<Item[]> => {
        try {
            const response = await axios.get<Item[]>(`http://localhost:8080/category/${categoryId}/items`, {
                headers: {
                    Authorization: `Bearer ${user?._id}`,
                },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching items by category:', error);
            return [];
        }
    };

    const updateItem = async (id: string, updatedItem: Partial<Item>, image?: File) => {
        if (!user || !isAuthenticated) {
            console.error('User is not authenticated');
            return;
        }

        try {
            const formData = new FormData();

            // Append updated item properties to FormData
            Object.keys(updatedItem).forEach((key) => {
                const value = updatedItem[key as keyof Item];
                if (value !== undefined) {
                    if (key === 'promotionEnd' && value instanceof Date) {
                        formData.append(key, value.toISOString());
                    } else if (key === 'quantityOffers') {
                        formData.append(key, JSON.stringify(value)); // Stringify quantityOffers array
                    } else {
                        formData.append(key, value as string | Blob);
                    }
                }
            });

            // Append image if provided
            if (image) {
                formData.append('imageUrl', image); // Ensure this matches backend field name
            }

            console.log('FormData content:', Array.from(formData.entries()));

            // Make PATCH request to update item
            const response = await axios.patch(`http://localhost:8080/item/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${user._id}`, // Ensure correct token
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                },
                withCredentials: true, // Adjust as needed
            });

            console.log('Update response:', response.data);

            // Update local state to reflect changes
            setItems((prevItems) =>
                prevItems.map((item) => (item._id === id ? { ...item, ...response.data } : item))
            );
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error updating item:', error.response?.data || error.message || error);
            } else {
                console.error('Unexpected error updating item:', error);
            }
        }
    };



    const deleteItem = async (id: string) => {
        if (!user || !isAuthenticated) {
            console.error('User is not authenticated');
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/item/${id}`, {
                headers: {
                    'Authorization': `Bearer ${user?._id}`,
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                },
                withCredentials: true,
            });
            setItems((prevItems) => prevItems.filter((item) => item._id !== id));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    return (
        <ItemContext.Provider
            value={{
                items,
                createItem,
                fetchItemById,
                fetchItemsBySupermarket,
                fetchItemsByCategory,
                updateItem,
                deleteItem,
            }}
        >
            {children}
        </ItemContext.Provider>
    );
};

export const useItem = () => {
    const context = useContext(ItemContext);
    if (!context) {
        throw new Error('useItem must be used within an ItemProvider');
    }
    return context;
};
