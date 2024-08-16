"use client"
import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '../redux';
import { RootState } from '../store/store';
import { useEffect, useState } from 'react';
import { setIsDarkMode, setIsSidebarCollapsed } from '../state';
import { Moon, Sun } from 'lucide-react';

const Header:React.FC = () => {

    const dispatch = useAppDispatch();
    // const isSidebarCollapsed = useSelector((state: RootState) => state.global.isSidebarCollapsed);
    const isDarkMode = useAppSelector((state: RootState) => state.global.isDarkMode);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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
        <header className="bg-stone-50 p-4 flex justify-between items-center">
            <div className="flex items-center">
                <Link href='/home'>
                    <Image src="/logo.svg" alt="Logo" width={100} height={70} className="mr-2" />
                </Link>
            </div>
            <nav className="flex space-x-4">
                <button onClick={toggleDarkMode}>
                    {isDarkMode ? (
                        <Sun className="cursor-pointer text-gray-500" size={24} />
                    ) : (
                        <Moon className="cursor-pointer text-gray-500" size={24} />
                    )}
                </button>
                <Link href="/" className="bg-black-600 hover:bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-medium">
                    Home
                </Link>
                <Link href="/signup" className="bg-gray-600 hover:bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-medium">
                    Signup
                </Link>
                <Link href="/login" className="bg-gray-600 hover:bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-medium">
                    Login
                </Link>
            </nav>
        </header>
    );
};

export default Header;
