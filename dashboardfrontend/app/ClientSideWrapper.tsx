"use client";
import React, { useEffect, useState } from "react";
import { useAppSelector, RootState } from './redux'
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
        <div
            className={`${isDarkMode ? "dark" : "light"} flex bg-gray-50 text-gray-900 w/full min-h-screen`}
        >
            <Sidebar />
            <main
                className={`flex flex-col w-full h-full py-7 px-9 bg-gray-50 ${isSidebarCollapsed ? "md:pl-24" : "md:pl-72"}`}
            >
                <Header />
                {children}
            </main>
        </div>
    );
};

const ClientSideWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
                <ClientSideLayout>{children}</ClientSideLayout>

    );
};

export default ClientSideWrapper;
