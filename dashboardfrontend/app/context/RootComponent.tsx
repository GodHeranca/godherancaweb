"use client";
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../redux'; // Ensure the path is correct
import ClientSideWrapper from '../ClientSideWrapper';
import { clearUser } from '@/app/state/authSlice'; // Ensure the path is correct
import StoreProvider from '../redux'; // Your custom StoreProvider
import { LoginProvider } from './LoginContext'; // Import the LoginContext
import i18n from '@/language/i18n';
import { I18nextProvider } from 'react-i18next';
import { ItemProvider } from './ItemContext';
import { SupermarketProvider } from '../context/SupermarketContext';
import { CategoryProvider } from './CategoryContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const RootComponent = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Reset auth state on mount if not authenticated
        dispatch(clearUser());
    }, [dispatch]);

    if (!mounted) return <div>Loading...</div>;

    return <>{children}</>; // Render children directly
};

const RootComponentWithProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
        <StoreProvider>
            <I18nextProvider i18n={i18n}>
                <LoginProvider>
                    <SupermarketProvider>
                        <CategoryProvider>
                            <ItemProvider>
                                <ClientSideWrapper>
                                    <RootComponent>{children}</RootComponent>
                                </ClientSideWrapper>
                            </ItemProvider>
                        </CategoryProvider>
                    </SupermarketProvider>
                </LoginProvider>
             </I18nextProvider>
        </StoreProvider>
        </GoogleOAuthProvider>
    );
};

export default RootComponentWithProvider;
