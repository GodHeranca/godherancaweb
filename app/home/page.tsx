"use client";
import React, { useState, useEffect } from "react";
import Image from 'next/legacy/image';
import Link from "next/link";
import { useSearch } from "@/context/SearchContext";
import { useSupermarkets } from "@/context/SupermarketContext";
import { Supermarket } from "@/context/SupermarketContext"; // Adjust the import path according to your project structure
import { useRouter } from "next/navigation";

interface HomeProps {
    userLocation: { lat: number; lon: number } | null;
    loading: boolean;
}

const Home: React.FC<HomeProps> = ({ userLocation, loading: userLocationLoading }) => {
    const { searchQuery } = useSearch();
    const { supermarkets, loading: supermarketsLoading, error } = useSupermarkets();
    const [selectedSupermarket, setSelectedSupermarket] = useState<Supermarket | null>(null);

    const router = useRouter();

    const filteredSupermarkets = supermarkets.filter((supermarket) =>
        supermarket.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSupermarketClick = (supermarket: Supermarket) => {
        setSelectedSupermarket(supermarket);
        router.push(`/supermarket/${supermarket._id}`);
    };

    useEffect(() => {
        console.log('User location:', userLocation);
        console.log('Filtered supermarkets:', filteredSupermarkets);
    }, [userLocation, filteredSupermarkets]);

    if (userLocationLoading || supermarketsLoading) {
        return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen"><p>Error loading supermarkets: {error}</p></div>;
    }

    return (
        <main className="flex flex-col items-start bg-white p-4 w-full max-w-screen-lg mx-auto">
            <h1 className="text-2xl font-bold mb-6">Supermercados Atacadistas</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                {filteredSupermarkets.length > 0 ? (
                    filteredSupermarkets.map((supermarket) => (
                        <div
                            key={supermarket._id}
                            className="transition transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg rounded-xl overflow-hidden bg-gray-50 cursor-pointer"
                            onClick={() => handleSupermarketClick(supermarket)}
                        >
                            <Link href={`/supermarket/${supermarket._id}`} legacyBehavior>
                                <a className="block w-full h-full">
                                    <Image
                                        src={supermarket.image || '/fallback-image.jpg'}
                                        alt={supermarket.name}
                                        width={400}
                                        height={200}
                                        priority={true}
                                        className="w-full h-auto object-cover"
                                    />
                                    <div className="p-4">
                                        <p className="text-lg font-semibold">{supermarket.name}</p>
                                        <p className="text-sm text-gray-600">{supermarket.address}</p>
                                    </div>
                                </a>
                            </Link>
                        </div>

                    ))
                ) : (
                    <p className="text-lg font-semibold col-span-full">Nenhum supermercado encontrado.</p>
                )}
            </div>

            <div className="mt-8 w-full">
                <h2 className="text-2xl font-bold mb-4">Em Breve</h2>
                <div className="flex justify-center items-center space-x-4">
                    <Image
                        src="/playstore.svg"
                        alt="Em breve no Play Store"
                        width={150}
                        height={50}
                        className="w-32 sm:w-36 md:w-40 lg:w-44"
                        priority={false}
                    />
                    <Image
                        src="/appstore.svg"
                        alt="Em breve no App Store"
                        width={150}
                        height={50}
                        className="w-32 sm:w-36 md:w-40 lg:w-44"
                        priority={false}
                    />
                </div>
            </div>
        </main>
    );
};

export default Home;
