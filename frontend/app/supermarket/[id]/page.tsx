"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useSupermarkets } from "@/context/SupermarketContext";
import SupermarketPage from "../SupermarketPage";

const SupermarketDetail: React.FC = () => {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    const { supermarkets, fetchSupermarketDetails, categories, items, loading, error, setCategories, setItems } = useSupermarkets();
    const supermarket = supermarkets.find((s) => s._id === id);

    useEffect(() => {
        if (id) {
            fetchSupermarketDetails(id); // Fetch details only if an ID is available
        }

        // Cleanup on unmount: reset categories and items if needed
        return () => {
            setCategories([]);
            setItems([]);
        };
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!supermarket) {
        return <p>Supermarket not found.</p>;
    }

    return (
        <SupermarketPage
            name={supermarket.name}
            image={supermarket.image || ""}
            address={supermarket.address}
            categories={categories.filter((cat) => cat.supermarketId === id)}
            items={items.filter((item) => item.supermarket === id)}
        />
    );
};

export default SupermarketDetail;
