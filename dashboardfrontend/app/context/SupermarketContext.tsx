import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { useLogin } from './LoginContext';

interface SupermarketDetails {
    id: string;
    name: string;
    address: string;
    categories?: number[]; // Array of Category IDs
    items?: string[]; // Array of Item IDs
}

interface SupermarketContextType {
    supermarketId: string | null;
    supermarketDetails: SupermarketDetails | null;
    fetchSupermarketDetails: () => Promise<void>;
}

const SupermarketContext = createContext<SupermarketContextType | undefined>(undefined);

export const SupermarketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [supermarketId, setSupermarketId] = useState<string | null>(null);
    const [supermarketDetails, setSupermarketDetails] = useState<SupermarketDetails | null>(null);
    const { user, isAuthenticated } = useLogin();

    useEffect(() => {
        if (isAuthenticated && user?.supermarketId) {
            setSupermarketId(user.supermarketId);
        }
    }, [isAuthenticated, user?.supermarketId]);

    const fetchSupermarketDetails = async () => {
        if (!supermarketId) {
            console.error('Supermarket ID is not available');
            return;
        }

        try {
            const response = await axios.get<SupermarketDetails>(`http://localhost:8080/supermarket/${supermarketId}`, {
                headers: {
                    'Authorization': `Bearer ${user?._id}`,
                },
            });
            setSupermarketDetails(response.data);
        } catch (error) {
            console.error('Error fetching supermarket details:', error);
        }
    };

    return (
        <SupermarketContext.Provider value={{ supermarketId, supermarketDetails, fetchSupermarketDetails }}>
            {children}
        </SupermarketContext.Provider>
    );
};

export const useSupermarket = () => {
    const context = useContext(SupermarketContext);
    if (!context) {
        throw new Error('useSupermarket must be used within a SupermarketProvider');
    }
    return context;
};
