import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios, { isAxiosError } from 'axios';
import { useLogin } from './LoginContext';
import { useSupermarket } from './SupermarketContext';

export interface Category {
    _id: string;
    name: string;
    image?: string;
    userId: string;
    supermarketId: string;
    parentCategory?: string;
    subcategories?: string[];
}

interface CategoryContextType {
    categories: Category[];
    fetchCategories: () => Promise<void>;
    createCategory: (formData: FormData, parentCategoryId?: string) => Promise<void>;
    updateCategory: (id: string, formData: FormData) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { user, isAuthenticated } = useLogin();
    const { supermarketId } = useSupermarket();

    const fetchCategories = async () => {
        if (!isAuthenticated || !user || !supermarketId) return; // Prevent fetching if required data is not available
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<Category[]>(`http://localhost:8080/supermarket/${supermarketId}/categories`, {
                headers: {
                    'Authorization': `Bearer ${user?._id}`,
                    'Accept': 'application/json',
                },
                withCredentials: true
            });
            setCategories(response.data);  // Update categories state
        } catch (error) {
            console.error('Error fetching categories:', error);
            if (isAxiosError(error)) {
                if (error.response?.status === 404) {
                    setError('No categories found for this supermarket.');
                } else {
                    setError('Failed to fetch categories. Please try again later.');
                }
            } else {
                setError('An unknown error occurred. Please try again later.');
            }
        } finally {
            setLoading(false);  // Ensure loading is set to false in finally block
        }
    };

    useEffect(() => {
        if (isAuthenticated && supermarketId) {
            fetchCategories();
        }
        // Only run when user authentication state or supermarketId changes
    }, [isAuthenticated, supermarketId]);

    const createCategory = async (formData: FormData, parentCategoryId?: string) => {
        if (!isAuthenticated || !user || !supermarketId) {
            throw new Error('User is not authenticated or supermarketId is missing');
        }

        setLoading(true);  // Set loading to true before making the API call

        try {
            formData.append('supermarketId', supermarketId);
            if (parentCategoryId) {
                formData.append('parentCategory', parentCategoryId);
            }

            await axios.post(`http://localhost:8080/category/${supermarketId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${user._id}`,
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                },
                withCredentials: true
            });
            await fetchCategories();  // Fetch updated categories
        } catch (error) {
            console.error('Error creating category:', error);
            setError('Failed to create category. Please try again.');
        } finally {
            setLoading(false);  // Reset loading state in finally block
        }
    };

    const updateCategory = async (id: string, formData: FormData) => {
        if (!isAuthenticated || !user) {
            throw new Error('User is not authenticated');
        }

        setLoading(true);  // Set loading to true before making the API call

        try {
            await axios.patch(`http://localhost:8080/category/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${user._id}`,
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                },
                withCredentials: true
            });
            await fetchCategories();  // Fetch updated categories
        } catch (error) {
            console.error('Error updating category:', error);
            setError('Failed to update category. Please try again.');
        } finally {
            setLoading(false);  // Reset loading state in finally block
        }
    };

    const deleteCategory = async (id: string) => {
        if (!isAuthenticated || !user) {
            setError('User is not authenticated');
            return;
        }

        setLoading(true);  // Set loading to true before making the API call

        try {
            await axios.delete(`http://localhost:8080/category/${id}`, {
                headers: {
                    'Authorization': `Bearer ${user._id}`,
                    'Accept': 'application/json',
                },
                withCredentials: true
            });

            await fetchCategories();  // Fetch updated categories
        } catch (error) {
            console.error('Error deleting category:', error);
            setError('Failed to delete category. Please try again.');
        } finally {
            setLoading(false);  // Reset loading state in finally block
        }
    };

    return (
        <CategoryContext.Provider value={{ categories, fetchCategories, createCategory, updateCategory, deleteCategory }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategory = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error('useCategory must be used within a CategoryProvider');
    }
    return context;
};
