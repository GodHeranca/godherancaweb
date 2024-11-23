"use client";
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../app/redux'; // Ensure the path is correct
import ClientSideWrapper from '../app/ClientSideWrapper';
import StoreProvider from '../app/redux'; // Your custom StoreProvider
import { SearchProvider, useSearch } from '@/context/SearchContext';
import { SupermarketProvider } from '@/context/SupermarketContext';

const RootComponent = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Reset auth state on mount if not authenticated
    }, [dispatch]);

    if (!mounted) return <div>Loading...</div>;

    return <>{children}</>; // Render children directly
};

const RootComponentWithProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <StoreProvider>
            <SearchProvider>
                <SupermarketProvider>
                    <ClientSideWrapper>
                        <RootComponent>{children}</RootComponent>
                    </ClientSideWrapper>
                </SupermarketProvider>
            </SearchProvider>
        </StoreProvider>
    );
};

export default RootComponentWithProvider;
