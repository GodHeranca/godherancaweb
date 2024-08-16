"use client";

import React, { useState, useEffect } from "react";
import StoreProvider, { useAppSelector, RootState } from '../redux'
import Header from "./Header"; // Adjust the path as necessary

const WrapperLayout = ({ children }: { children: React.ReactNode }) => {
    const isDarkMode = useAppSelector((state: RootState) => state.global.isDarkMode);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
            document.documentElement.classList.remove("light");
        } else {
            document.documentElement.classList.add("light");
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    if (!mounted) return <div>Loading...</div>;

    return (
        
        <div className={`${isDarkMode ? "dark" : "light"} bg-stone-50 text-gray-900 w-full min-h-screen`}>
            <main className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 bg-stone-50">
                <Header />
                <div className="flex-1 flex flex-col justify-center items-center ">
                    {children}
                </div>
            </main>
        </div>
    );
};

const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <StoreProvider>
            <WrapperLayout>{children}</WrapperLayout>
        </StoreProvider>
    );
};

export default Wrapper;
