
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the shape of the user data
interface User {
    _id: string;
    username: string;
    email: string;
    profilePicture?: string;
    address: string[];
    phone: string;
    profile: string;
    uid: string;
    supermarketId?: string;  // Make optional if not every user has it
    driverId?: string;
    clientId?: string;
    pickerId?: string;
    adminId?: string;
    authentication: {
        password: string;
        sessionToken?: string;
        salt: string;
    };
    // Add other user fields here
}

// Define the shape of the context state
interface LoginContextType {
    isAuthenticated: boolean;
    user: User | null;
    updateUser: (data: FormData) => Promise<void>;
    updatePassword: (password: string) => Promise<void>;
    updateProfilePicture: (picture: File) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    supermarketId: string | null;
}

// Create the context with an initial value of null
const LoginContext = createContext<LoginContextType | null>(null);

export const LoginProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    // Function to handle login
    const login = async (email: string, password: string) => {
        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include', // Ensure cookies are included with the request
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const userData = await response.json();
            setIsAuthenticated(true);
            setUser(userData);
        } catch (error) {
            console.error('Failed to login:', error);
            throw error;
        }
    };

    // Function to handle logout
    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    // Function to update the user profile
    const updateUser = async (data: FormData) => {
        if (!user || !user._id) {
            console.error('User ID is not available');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/users/${user._id}`, {
                method: 'PATCH',
                body: data,
                credentials: 'include', // Ensure cookies are included with the request
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const updatedUser = await response.json();
            setUser(updatedUser);
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    // Function to update the user's password
    const updatePassword = async (password: string) => {
        if (!user || !user._id) {
            console.error('User ID is not available');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/users/${user._id}`, {
                method: 'PATCH',
                body: JSON.stringify({ password }),
                credentials: 'include', // Ensure cookies are included with the request
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            console.log('Password updated successfully');
        } catch (error) {
            console.error('Failed to update password:', error);
        }
    };

    const updateProfilePicture = async (picture: File) => {
        if (!user || !user._id) {
            console.error('User ID is not available');
            return;
        }

        const formData = new FormData();
        formData.append('profilePicture', picture);

        try {
            const response = await fetch(`http://localhost:8080/users/${user._id}`, {
                method: 'PATCH',
                body: formData,
                credentials: 'include', // Ensure cookies are included with the request
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const updatedUser = await response.json();
            setUser(updatedUser); // Update the user state with the new data
        } catch (error) {
            console.error('Failed to update profile picture:', error);
        }
    };

    // Fetch user data from the backend if session exists on mount
    useEffect(() => {
        const checkAuth = async () => {
            if (!user || !user._id) return;

            try {
                const response = await fetch(`http://localhost:8080/users/${user._id}`, {
                    method: 'GET',
                    credentials: 'include', // Include cookies with the request
                });

                if (response.ok) {
                    const userData = await response.json();
                    setIsAuthenticated(true);
                    setUser(userData);
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                console.error('Failed to check auth status:', error);
                setIsAuthenticated(false);
                setUser(null);
            }
        };

        checkAuth();
    }, [user?._id]);

    return (
        <LoginContext.Provider value={{ isAuthenticated, user, updateUser, supermarketId: user?.supermarketId || null, updateProfilePicture, updatePassword, login, logout }}>
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