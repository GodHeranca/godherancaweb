"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Ensure correct import
import ProfileClient from "./ProfileClient";
import { useLogin } from "../context/LoginContext"; // Import the useLogin hook

const ProfilePage = () => {
    const { isAuthenticated, user } = useLogin(); // Get authentication state and user data from LoginContext
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated || !user) {
        return null; // Optionally, you could render a loading spinner or some placeholder here
    }

    return (
        <div className="flex justify-center items-center h-full w-full">
            <ProfileClient />
        </div>
    );
};

export default ProfilePage;
