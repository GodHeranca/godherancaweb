"use client";

import { useDispatch, useSelector } from "react-redux";
import { setIsSidebarCollapsed } from "@/app/state/globalSlice"; // Adjust the import path as needed
import {
    Archive,
    CircleDollarSign,
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
import { RootState } from "@/app/store/store";

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
        pathname === href || (pathname === "/" && href === "/dashboard");

    return (
        <Link href={href}>
            <div
                className={`cursor-pointer flex items-center ${isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"
                    } hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors ${isActive ? "bg-blue-200 text-white" : ""}`}
            >
                <Icon className="w-6 h-6 !text-gray-700" />
                {!isCollapsed && (
                    <span className="font-medium text-gray-700">{label}</span>
                )}
            </div>
        </Link>
    );
};

const Sidebar = () => {
    const dispatch = useDispatch();
    const isSidebarCollapsed = useSelector(
        (state: RootState) => state.global.isSidebarCollapsed
    );

    const toggleSidebar = () => {
        dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
    };

    const sidebarClassNames = `fixed flex flex-col ${isSidebarCollapsed ? "w-16" : "w-64"
        } bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40`;

    return (
        <div className={sidebarClassNames}>
            {/* TOP LOGO */}
            <div
                className={`flex gap-3 justify-between md:justify-normal items-center pt-8 ${isSidebarCollapsed ? "px-5" : "px-8"
                    }`}
            >
                <Link href='/dashboard'>
                    <Image
                        src="/logo.svg"
                        alt="Godheranca"
                        width={27}
                        height={27}
                        className="rounded w-8"
                    />
                </Link>
                <Link href='/dashboard'>
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

            {/* LINKS */}
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
                {/* <SidebarLink
                    href="/users"
                    icon={User}
                    label="Users"
                    isCollapsed={isSidebarCollapsed}
                /> */}
                <SidebarLink
                    href="/settings"
                    icon={SlidersHorizontal}
                    label="Settings"
                    isCollapsed={isSidebarCollapsed}
                />
                {/* <SidebarLink
                    href="/expenses"
                    icon={CircleDollarSign}
                    label="Expenses"
                    isCollapsed={isSidebarCollapsed}
                /> */}
            </div>

            {/* FOOTER */}
            {!isSidebarCollapsed && (
                <div className="mb-10">
                    <p className="text-center text-xs text-gray-500">&copy; 2024 GodHeranca</p>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
