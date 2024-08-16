import { useAppDispatch, useAppSelector, RootState } from "../app/redux";
import { useState, useEffect } from "react";
import { setIsSidebarCollapsed, setIsDarkMode } from "../app/state";
import { Menu, Moon, Sun } from "lucide-react";
import { FaCog, FaSearch, FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useLogin } from "../app/LoginContext"; // Adjust this import to your actual LoginContext path

const Header: React.FC = () => {
    const dispatch = useAppDispatch();
    const isSidebarCollapsed = useAppSelector(
        (state: RootState) => state.global.isSidebarCollapsed
    );
    const isDarkMode = useAppSelector(
        (state: RootState) => state.global.isDarkMode
    );

    const [mounted, setMounted] = useState(false);
    const { isAuthenticated, logout } = useLogin(); // Use the LoginContext to determine if the user is logged in and handle logout
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleSidebar = () => {
        dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
    };

    const toggleDarkMode = () => {
        dispatch(setIsDarkMode(!isDarkMode));
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        if (mounted) {
            const htmlElement = document.documentElement;
            if (isDarkMode) {
                htmlElement.classList.add("dark");
                htmlElement.classList.remove("light");
            } else {
                htmlElement.classList.add("light");
                htmlElement.classList.remove("dark");
            }
        }
    }, [isDarkMode, mounted]);

    if (!mounted) return null;

    return (
        <div className="flex justify-between items-center w-full mb-4">
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

            <div className="flex justify-between items-center gap-5">
                <div className="hidden md:flex justify-between items-center gap-5">
                    <button onClick={toggleDarkMode}>
                        {isDarkMode ? (
                            <Sun
                                className="cursor-pointer text-gray-500"
                                size={24}
                            />
                        ) : (
                                <Moon
                                    className="cursor-pointer text-gray-500"
                                    size={24}
                                />
                        )}
                    </button>
                    <hr className="w-0 h-7 border border-solid border-l border-gray-300 mx-3" />

                    <div className="relative">
                        <button onClick={toggleDropdown} className="flex items-center gap-2 cursor-pointer">
                            {isAuthenticated ? (
                                <Image
                                    src="/desco.png"
                                    alt="Profile"
                                    width={40}
                                    height={40}
                                    className="rounded-full h-full object-cover"
                                />
                            ) : (
                                <FaUserCircle className="text-2xl cursor-pointer text-gray-500" />
                            )}
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
                                {isAuthenticated ? (
                                    <>
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={closeDropdown}
                                        >
                                            View Profile
                                        </Link>
                                        <Link href='/home'>
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    closeDropdown();
                                                }}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Logout
                                            </button>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={closeDropdown}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/signup"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={closeDropdown}
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <Link href="/settings">
                    <FaCog
                        className="text-2xl cursor-pointer"
                        title="Settings"
                    />
                </Link>
            </div>
        </div>
    );
};

export default Header;
