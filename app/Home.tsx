"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearch } from "@/context/SearchContext";
import { supermarkets, Supermarket } from "@/data/SupermarketData";

interface HomeProps {
    userLocation: { lat: number, lon: number } | null;
    loading: boolean;
}

const Home: React.FC<HomeProps> = ({ userLocation, loading }) => {
    const { searchQuery } = useSearch();

    const filteredSupermarkets = supermarkets.filter((supermarket) => {
        const matchesSearch = supermarket.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    useEffect(() => {
        console.log('User location:', userLocation);
        console.log('Filtered supermarkets:', filteredSupermarkets);
    }, [userLocation, filteredSupermarkets]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <main className="flex flex-col items-start bg-white p-4">
            <p className="text-xl font-bold mb-4">Supermercados atacadistas</p>

            <div className="flex flex-wrap justify-between space-x-0 sm:space-x-8">
                {filteredSupermarkets.length > 0 ? (
                    filteredSupermarkets.map((supermarket: Supermarket, index) => (
                        <div key={index} className="flex flex-col sm:flex-row h-auto rounded-3xl w-full sm:w-auto mb-4">
                            <Link href={{
                                pathname: `/supermarket/${supermarket.name}`,
                                query: {
                                    name: supermarket.name,
                                    image: supermarket.image,
                                    address: supermarket.address,
                                    categories: JSON.stringify(supermarket.categories),
                                    items: JSON.stringify(supermarket.items),
                                }
                            }} className="flex flex-col items-start w-full">
                                <Image
                                    src={supermarket.image}
                                    alt={supermarket.name}
                                    width={559}
                                    height={241}
                                    className="rounded-3xl w-full sm:w-auto"
                                />
                                <p className="mt-1 text-lg font-semibold text-left">{supermarket.name}</p>
                                <p className="text-sm text-gray-600">{supermarket.address}</p>
                            </Link>
                        </div>
                    ))
                ) : (
                    <p className="text-lg font-semibold">No supermarkets found.</p>
                )}
            </div>

            <div className="flex flex-col items-start mt-8 w-full">
                <p className="text-xl font-bold">Em Breve</p>
                <div className="flex flex-wrap justify-center space-x-0 sm:space-x-8 -mt-8 w-full">
                    <div className="flex flex-col items-center mb-4 sm:mb-0 w-1/2 sm:w-auto">
                        <Image
                            src="/playstore.svg"
                            alt="Coming Soon on Play Store"
                            width={150}
                            height={50}
                            className="w-full sm:w-auto"
                        />
                    </div>
                    <div className="flex flex-col items-center w-1/2 sm:w-auto">
                        <Image
                            src="/appstore.svg"
                            alt="Coming Soon on App Store"
                            width={150}
                            height={50}
                            className="w-full sm:w-auto"
                        />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Home;
