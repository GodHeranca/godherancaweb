'use client';
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearch } from "@/context/SearchContext";

const supermarkets = [
  { name: 'Desco Atacado', image: '/Desco_Campo-Bom.jpg', link: '/Supermarket', address: ' Av. Senador Alberto Pasqualini, 659-787 - Americano, Lajeado - RS, 95900-000' },
  { name: 'Imec Supermercados', image: '/imec.jpg', link: '/Supermarket', address: 'R. Irmando Weissheimer, 100 - Montanha, Lajeado - RS, 95900-000' },
];

interface HomeProps {
  userLocation: { lat: number, lon: number } | null;
  loading: boolean;
}

const Home: React.FC<HomeProps> = ({ userLocation, loading }) => {
  const { searchQuery } = useSearch();

  // Filter supermarkets based on search query and other criteria
  const filteredSupermarkets = supermarkets.filter((supermarket) => {
    const matchesSearch = supermarket.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  useEffect(() => {
    console.log('User location:', userLocation);
    console.log('Filtered supermarkets:', filteredSupermarkets);
  }, [userLocation, filteredSupermarkets]);

  if (loading) {
    return <p>Loading...</p>; // Show a loading message or spinner
  }

  return (
    <main className="flex flex-col items-start bg-white p-4">
      <p className="text-xl font-bold mb-4">Supermercados atacadistas</p>

      <div className="flex flex-wrap justify-between space-x-8">
        {filteredSupermarkets.length > 0 ? (
          filteredSupermarkets.map((supermarket, index) => (
            <div key={index} className="flex h-auto rounded-3xl w-auto mb-4">
              <Link href={supermarket.link} className="flex flex-col items-start">
                <Image
                  src={supermarket.image}
                  alt={supermarket.name}
                  width={559}
                  height={241}
                  className="rounded-3xl"
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
        <div className="flex space-x-8 -mt-4">
          <div className="flex flex-col items-center">
            <Image
              src="/playstore.svg"
              alt="Coming Soon on Play Store"
              width={150}
              height={50}
            />
          </div>
          <div className="flex flex-col items-center">
            <Image
              src="/appstore.svg"
              alt="Coming Soon on App Store"
              width={150}
              height={50}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
