"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "@/components/Footer";


const ClientSideLayout = ({ children }: { children: React.ReactNode }) => {

    const [mounted, setMounted] = useState(false);
    const [userLocation, setUserLocation] = useState<{ lat: number, lon: number } | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);


    if (!mounted) return <div>Loading...</div>;

    return (
        <div className={`flex min-h-screen bg-white text-black`}>
            <main className={`flex flex-col w-full h-full py-7 px-9 bg-white text-black`}>
                <Header setUserLocation={setUserLocation} />
                {children}
                <Footer />
            </main>
        </div>
    );
};


const ClientSideWrapper = ({ children }: { children: React.ReactNode }) => {
    return <ClientSideLayout>{children}</ClientSideLayout>;
};

export default ClientSideWrapper;
