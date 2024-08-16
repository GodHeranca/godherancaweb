"use client";
import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch, RootState } from './redux'; // Ensure the path is correct
import ClientSideWrapper from './ClientSideWrapper';
import { clearUser } from '@/app/state/authSlice'; // Ensure the path is correct
import StoreProvider from './redux'; // Your custom StoreProvider
import { LoginProvider } from './LoginContext'; // Import the LoginContext
import i18n from '@/language/i18n';
import { I18nextProvider } from 'react-i18next';

const RootComponent = ({ children }: { children: React.ReactNode }) => {
    // const isAuthenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated);
    const dispatch = useAppDispatch();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Reset auth state on mount if not authenticated
        dispatch(clearUser());
    }, [ dispatch]);

    if (!mounted) return <div>Loading...</div>;

    return  (
        <ClientSideWrapper>
            {children}
        </ClientSideWrapper>
    ) 
};

const RootComponentWithProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <StoreProvider>
            <I18nextProvider i18n={i18n}>
                <LoginProvider>
                    <RootComponent>
                        {children}
                    </RootComponent>
                </LoginProvider>
            </I18nextProvider>
        </StoreProvider>
    );
};

export default RootComponentWithProvider;
