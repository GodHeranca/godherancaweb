"use client"
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearch } from "@/context/SearchContext";

const supermarkets = [
  { name: 'Desco Atacado', image: '/Desco_Campo-Bom.jpg', link: '/supermarket-page' },
  { name: 'Imec', image: '/imec.jpg', link: '/supermarket-page' },
];

const Home: React.FC = () => {
  const { searchQuery } = useSearch();
  const filteredSupermarkets = supermarkets.filter((supermarket) =>
    supermarket.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <main className="flex flex-col items-start bg-white p-4">
      <p className="text-xl font-bold mb-4">Supermercado Atacadista</p>

      <div className="flex flex-wrap justify-between space-x-8">
        {filteredSupermarkets.length > 0 ? (
          filteredSupermarkets.map((supermarket, index) => (
            <div key={index} className="flex h-auto rounded-3xl w-auto mb-4">
              <Link href={supermarket.link} className="flex flex-col items-start ">
                <Image
                  src={supermarket.image}
                  alt={supermarket.name}
                  width={559}
                  height={241}
                  className="rounded-3xl"
                />
                <p className="mt-1 text-lg font-semibold text-left">{supermarket.name}</p>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-lg font-semibold">Nenhum supermercado encontrado.</p>
        )}
      </div>

      <div className="flex flex-col items-start mt-8 w-full">
        <p className="text-xl font-bold ">Em Breve</p>
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
