import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the user data
interface User {
    _id: string;
    username: string;
    email: string;
    profilePicture?: string;
    address: string[]; // Changed to string for single address
    phone: string;
    profile: string;
    uid: string;
    // Add other user fields here
}

// Define the shape of the context state
interface LoginContextType {
    isAuthenticated: boolean;
    user: User | null;
    updateUser: (data: FormData) => Promise<void>;
    login: (user: User) => void;
    logout: () => void;
}

// Create the context with an initial value of null
const LoginContext = createContext<LoginContextType | null>(null);

export const LoginProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    const login = (user: User) => {
        setIsAuthenticated(true);
        setUser(user);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    const updateUser = async (data: FormData) => {
        if (!user || !user._id) {
            console.error('User ID is not available');
            return;
        }

       const uid = user._id // Extract the user ID from the current user state

        try {
            const response = await fetch(`http://localhost:8080/users/${uid}`, {
                method: 'PATCH',
                body: data,
                credentials: 'include', // Include cookies with the request
                headers: {
                    'Accept': 'application/json',
                    // 'Content-Type': 'multipart/form-data', // Not needed with FormData
                },
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || 'Failed to update user');
            }

            const updatedUser = await response.json();
            setUser(updatedUser);
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };


    return (
        <LoginContext.Provider value={{ isAuthenticated, user, updateUser, login, logout }}>
            {children}
        </LoginContext.Provider>
    );
};

export const useLogin = () => {
    const context = useContext(LoginContext);
    if (!context) {
        throw new Error('useLogin must be used within a LoginProvider');
    }
    return context;
};
