"use client"
import React, { useState } from 'react';
import Header from '@/components/Header';
import { SearchProvider } from '@/context/SearchContext';

const ClientWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userLocation, setUserLocation] = useState<{ lat: number, lon: number } | null>(null);

    return (
        <SearchProvider>
            <Header setUserLocation={setUserLocation} />
            {React.cloneElement(children as React.ReactElement<any>, { userLocation })}
        </SearchProvider>
    );
};

export default ClientWrapper;
