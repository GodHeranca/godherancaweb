"use client";
import React, { useEffect, useState } from "react";
import { useAppSelector, RootState } from './redux';
import Header from "../app/components/Header";
import Sidebar from "../app/components/Sidebar";

const ClientSideLayout = ({ children }: { children: React.ReactNode }) => {
    const isSidebarCollapsed = useAppSelector((state: RootState) => state.global.isSidebarCollapsed);
    const isDarkMode = useAppSelector((state: RootState) => state.global.isDarkMode);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // Apply or remove the dark class based on theme state
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    if (!mounted) return <div>Loading...</div>;

    return (
        <div
            className={`flex min-h-screen ${isDarkMode ? "bg-white text-gray-100" : "bg-gray-50 text-gray-900"}`}
        >
            <Sidebar />
            <main
                className={`flex flex-col w-full h-full py-7 px-9 ${isDarkMode ? "bg-white" : "bg-white"} ${isSidebarCollapsed ? "md:pl-24" : "md:pl-72"}`}
            >
                <Header />
                {children}
            </main>
        </div>
    );
};

const ClientSideWrapper = ({ children }: { children: React.ReactNode }) => {
    return <ClientSideLayout>{children}</ClientSideLayout>;
};

export default ClientSideWrapper;
