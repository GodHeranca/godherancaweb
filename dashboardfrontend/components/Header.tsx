"use client";

import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { RootState } from '../app/store/store'; // Adjust path based on your project structure
import { setIsSidebarCollapsed, setIsDarkMode } from '../app/state/globalSlice';
import { Bell, Menu, Moon, Sun } from "lucide-react";
import { FaCog, FaSearch, FaUserCircle } from "react-icons/fa";
import Link from 'next/link';
import Image from 'next/image';

const Header: React.FC = () => {
    const dispatch = useDispatch();
    const isSidebarCollapsed = useSelector((state: RootState) => state.global.isSidebarCollapsed);
    const isDarkMode = useSelector((state: RootState) => state.global.isDarkMode);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleSidebar = () => {
        dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
    };

    const toggleDarkMode = () => {
        dispatch(setIsDarkMode(!isDarkMode));
    };

    useEffect(() => {
        if (mounted) {
            const htmlElement = document.documentElement;
            if (isDarkMode) {
                htmlElement.classList.add('dark');
                htmlElement.classList.remove('light');
            } else {
                htmlElement.classList.add('light');
                htmlElement.classList.remove('dark');
            }
        }
    }, [isDarkMode, mounted]);

    if (!mounted) return null;

    return (
        <div className="flex justify-between items-center w-full mb-4">
            {/* LEFT SIDE */}
            <div className="flex justify-between items-center gap-5">
                <button
                    className="px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
                    onClick={toggleSidebar}
                >
                    <Menu className="w-4 h-4" />
                </button>

                <div className="relative">
                    <input
                        type="search"
                        placeholder="Start typing to search groups & products"
                        className="pl-10 pr-4 py-2 w-50 md:w-60 border-2 border-gray-300 bg-white rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-500" size={20} />
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex justify-between items-center gap-5">
                <div className="hidden md:flex justify-between items-center gap-5">
                    <button onClick={toggleDarkMode}>
                        {isDarkMode ? (
                            <Sun className="cursor-pointer text-gray-500" size={24} />
                        ) : (
                            <Moon className="cursor-pointer text-gray-500" size={24} />
                        )}
                    </button>
                    <hr className="w-0 h-7 border border-solid border-l border-gray-300 mx-3" />
                    <div className="flex items-center gap-3 cursor-pointer">
                        <Image
                            src="/desco.png"
                            alt="Profile"
                            width={50}
                            height={50}
                            className="rounded-full h-full object-cover"
                        />
                        <span className="font-semibold">Desco</span>
                    </div>
                </div>
                <Link href="/settings">
                    <FaCog className="text-2xl cursor-pointer" title="Settings" />
                </Link>
            </div>
        </div>
    );
};

export default Header;
