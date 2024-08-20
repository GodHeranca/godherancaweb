import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { useLogin } from './LoginContext';


export interface Category {
    _id: string;
    name: string;
    image?: string;
    userId: string; // userId as a string, which represents the ID of the user
}


interface CategoryContextType {
    categories: Category[];
    fetchCategories: () => Promise<void>;
    createCategory: (formData: FormData) => Promise<void>;
    updateCategory: (id: string, formData: FormData) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>; // Add deleteCategory to the context type
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const { user, isAuthenticated } = useLogin();

    useEffect(() => {
        if (isAuthenticated) {
            fetchCategories();
        }
    }, [isAuthenticated]);

    const fetchCategories = async () => {
        if (!isAuthenticated || !user?._id) return;

        try {
            const response = await axios.get<Category[]>('http://localhost:8080/category', {
                headers: {
                    'Authorization': `Bearer ${user._id}`,
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                },
                withCredentials: true
            });
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const createCategory = async (formData: FormData) => {
        if (!isAuthenticated || !user) {
            throw new Error('User is not authenticated');
        }
        try {
            await axios.post(`http://localhost:8080/category/${user._id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${user?._id}`,
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                },
                withCredentials: true
            });
            fetchCategories();
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };

    const updateCategory = async (_id: string, formData: FormData) => {
        if (!isAuthenticated || !user) {
            throw new Error('User is not authenticated');
        }
        try {
            await axios.patch(`http://localhost:8080/category/${_id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${user?._id}`,
                    'Accept': 'application/json',
                },
                withCredentials: true
            });
            fetchCategories();
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    // Add the deleteCategory function
    const deleteCategory = async (id: string) => {
        if (!isAuthenticated || !user) {
            throw new Error('User is not authenticated');
        }
        try {
            await axios.delete(`http://localhost:8080/category/${id}`, {
                headers: {
                    'Authorization': `Bearer ${user._id}`,
                },
                withCredentials: true
            });
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
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
