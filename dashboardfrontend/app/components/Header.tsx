import { useAppDispatch, useAppSelector, RootState } from "../redux";
import { useState, useEffect } from "react";
import { setIsSidebarCollapsed, setIsDarkMode } from "../state";
import { Menu, Moon, Sun } from "lucide-react";
import { FaCog, FaSearch, FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useLogin } from "../context/LoginContext"; // Adjust this import to your actual LoginContext path

const Header: React.FC = () => {
    const dispatch = useAppDispatch();
    const isSidebarCollapsed = useAppSelector(
        (state: RootState) => state.global.isSidebarCollapsed
    );
    const isDarkMode = useAppSelector(
        (state: RootState) => state.global.isDarkMode
    );

    const [mounted, setMounted] = useState(false);
    const { isAuthenticated, logout, user } = useLogin(); // Retrieve the user object from LoginContext
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
        <div className="flex justify-between items-center w-full mb-4 bg-white">
            <div className="flex justify-between items-center gap-5">
                <button
                    className="px-3 py-3 bg-gray-100 rounded-full hover:bg-gray-300"
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
                    {/* <button onClick={toggleDarkMode}>
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
                    </button> */}
                    <hr className="w-0 h-7 border border-solid border-l border-gray-300 mx-3" />

                    <div className="relative">
                        <button onClick={toggleDropdown} className="flex items-center gap-2 cursor-pointer">
                            {isAuthenticated && user ? (
                                <div
                                    className="relative w-20 h-20 rounded-full overflow-hidden"
                                    style={{ width: '60px', height: '60px' }} // Ensure the container is square
                                >
                                    <Image
                                        src={user.profilePicture || ''}
                                        alt="Profile"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
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
                                            className="block px-4 py-2 text-sm text-black-700 hover:bg-gray-400"
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
                                                className="block w-full text-left px-4 py-2 text-sm text-black-700 hover:bg-gray-400"
                                            >
                                                Logout
                                            </button>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-600 rounded-md"
                                            onClick={closeDropdown}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/signup"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-600 rounded-md"
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

                {isAuthenticated && (
                    <Link href="/settings">
                        <FaCog
                            className="text-2xl cursor-pointer"
                            title="Settings"
                        />
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Header;
