// Sidebar.tsx
"use client";
import { setIsSidebarCollapsed } from "@/app/state";
import {
    Archive,
    Clipboard,
    Layout,
    LucideIcon,
    Menu,
    SlidersHorizontal,
    User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useAppDispatch, useAppSelector } from "../app/redux";
import { useLogin } from "../app/LoginContext"; // Import the useLogin hook

interface SidebarLinkProps {
    href: string;
    icon: LucideIcon;
    label: string;
    isCollapsed: boolean;
}

const SidebarLink = ({
    href,
    icon: Icon,
    label,
    isCollapsed,
}: SidebarLinkProps) => {
    const pathname = usePathname();
    const isActive =
        pathname === href || (pathname === "/" && href === "/home");

    return (
        <Link href={href}>
            <div
                className={`cursor-pointer flex items-center ${isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"
                    }
        hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors ${isActive ? "bg-blue-200 text-white" : ""
                    }
      }`}
            >
                <Icon className="w-6 h-6 !text-gray-700" />

                <span
                    className={`${isCollapsed ? "hidden" : "block"
                        } font-medium text-gray-700`}
                >
                    {label}
                </span>
            </div>
        </Link>
    );
};

const Sidebar = () => {
    const dispatch = useAppDispatch();
    const isSidebarCollapsed = useAppSelector(
        (state) => state.global.isSidebarCollapsed
    );
    const { isAuthenticated } = useLogin(); // Get the authentication state from LoginContext

    const toggleSidebar = () => {
        dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
    };

    const sidebarClassNames = `fixed flex flex-col ${isSidebarCollapsed ? "w-16" : "w-64"
        } bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40`;

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className={sidebarClassNames}>
            <div
                className={`flex gap-3 justify-between md:justify-normal items-center pt-8 ${isSidebarCollapsed ? "px-5" : "px-8"
                    }`}
            >
                <Link href="/home">
                    <Image
                        src="/logo.svg"
                        alt="Godheranca"
                        width={27}
                        height={27}
                        className="rounded w-8"
                    />
                </Link>
                <Link href="/home">
                    {!isSidebarCollapsed && (
                        <h1 className="font-extrabold text-xl">GodHerança</h1>
                    )}
                </Link>

                <button
                    className="md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
                    onClick={toggleSidebar}
                >
                    <Menu className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-grow mt-8">
                <SidebarLink
                    href="/dashboard"
                    icon={Layout}
                    label="Dashboard"
                    isCollapsed={isSidebarCollapsed}
                />
                <SidebarLink
                    href="/inventory"
                    icon={Archive}
                    label="Inventory"
                    isCollapsed={isSidebarCollapsed}
                />
                <SidebarLink
                    href="/products"
                    icon={Clipboard}
                    label="Products"
                    isCollapsed={isSidebarCollapsed}
                />
                <SidebarLink
                    href="/settings"
                    icon={SlidersHorizontal}
                    label="Settings"
                    isCollapsed={isSidebarCollapsed}
                />
                <SidebarLink
                    href="/profile"
                    icon={User}
                    label="Profile"
                    isCollapsed={isSidebarCollapsed}
                />
            </div>

            {!isSidebarCollapsed && (
                <div className="mb-10">
                    <p className="text-center text-xs text-gray-500">
                        &copy; 2024 GodHeranca
                    </p>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
