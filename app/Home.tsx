"use client";
import React, { useState, useEffect } from "react";
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
    const [selectedSupermarket, setSelectedSupermarket] = useState<Supermarket | null>(null);

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
        <main className="flex flex-col items-start bg-white p-4 w-full">
            <p className="text-xl font-bold mb-4">Supermercados atacadistas</p>

            <div className="flex flex-wrap justify-start space-y-4 sm:space-y-0 sm:space-x-8 w-full">
                {filteredSupermarkets.length > 0 ? (
                    filteredSupermarkets.map((supermarket: Supermarket, index) => (
                        <div
                            key={index}
                            className=" transition duration-200 ease-in-out hover:scale-105 hover:shadow-lg flex flex-col sm:flex-row h-auto rounded-2xl w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 mb-4"
                            onClick={() => setSelectedSupermarket(supermarket)}
                        >
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
                                <p className="text-sm text-gray-600 ">{supermarket.address}</p>
                            </Link>
                        </div>
                    ))
                ) : (
                    <p className="text-lg font-semibold">No supermarkets found.</p>
                )}
            </div>

            {selectedSupermarket && (
                <div className="mt-4 p-4 border border-gray-300 rounded-lg">
                    <h2 className="text-xl font-bold">{selectedSupermarket.name}</h2>
                    <p>{selectedSupermarket.address}</p>
                    <p>Categories: {selectedSupermarket.categories.join(', ')}</p>
                    <p>Items: {selectedSupermarket.items.join(', ')}</p>
                </div>
            )}

            <div className="flex flex-col items-start mt-8 w-full">
                <p className="text-xl font-bold mb-4">Em Breve</p>
                <div className="flex flex-wrap justify-center space-x-0 sm:space-x-8 -mt-8 w-full">
                    <div className="flex flex-col items-center  w-2/4 sm:-mb-0  sm:w-auto md:w-1/4 lg:w-1/4 xl:w-1/4">
                        <Image
                            src="/playstore.svg"
                            alt="Coming Soon on Play Store"
                            width={150}
                            height={50}
                            className="w-2/4 sm:w-auto "
                        />
                    </div>
                    <div className="flex flex-col items-center w-2/4  sm:w-auto md:w-1/4 lg:w-1/4 xl:w-1/4 ">
                        <Image
                            src="/appstore.svg"
                            alt="Coming Soon on App Store"
                            width={150}
                            height={50}
                            className="w-2/4 sm:w-auto"
                        />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Home;
