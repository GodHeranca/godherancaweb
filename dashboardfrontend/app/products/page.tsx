"use client";
import { PlusCircleIcon, Trash2Icon, EditIcon } from "lucide-react";
import { useState } from "react";
import CreateProductModal from "./CreateProductModal";
import Image from "next/image";
import { Item, Supermarket } from "@/data/supermarketType";
import { supermarkets as initialSupermarkets } from "@/data/supermarketData";

const Products = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [supermarkets, setSupermarkets] = useState<Supermarket[]>(initialSupermarkets);
    const [editingProduct, setEditingProduct] = useState<Item | null>(null);

    // Filter products based on the search term
    const filteredProducts = supermarkets?.flatMap((supermarket) =>
        supermarket.items.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    ) || [];

    const handleCreateOrUpdateProduct = (productData: Item) => {
        const updatedSupermarkets = [...supermarkets];

        if (editingProduct) {
            // Update existing product
            updatedSupermarkets.forEach(supermarket => {
                supermarket.items = supermarket.items.map(item =>
                    item.id === productData.id ? productData : item
                );
            });
        } else {
            // Add new product
            updatedSupermarkets[0].items.push(productData);
        }

        setSupermarkets(updatedSupermarkets);
        setEditingProduct(null); // Reset editing product
    };

    const handleEditProduct = (product: Item) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteProduct = (productId: string) => {
        const updatedSupermarkets = supermarkets.map((supermarket) => ({
            ...supermarket,
            items: supermarket.items.filter((item) => item.id !== productId),
        }));

        setSupermarkets(updatedSupermarkets);
    };

    return (
        <div className="mx-auto pb-5 w-full">
            {/* SEARCH BAR */}
            <div className="mb-6">
                <div className="flex items-center border-2 border-gray-200 rounded">
                    <input
                        className="w-full py-2 px-4 rounded bg-white"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* HEADER BAR */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Produtos</h2>
                <button
                    className="flex items-center bg-gray-600 hover:bg-black-300 text-gray-200 font-bold py-2 px-4 rounded"
                    onClick={() => {
                        setEditingProduct(null); // Clear editing state when creating a new product
                        setIsModalOpen(true);
                    }}
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Criar Produto
                </button>
            </div>

            {/* BODY PRODUCTS LIST */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
                {filteredProducts.length === 0 ? (
                    <div className="text-center text-gray-500">Nenhum produto encontrado</div>
                ) : (
                    filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
                        >
                            <div className="flex flex-col items-center">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={150}
                                    height={150}
                                    className="mb-3 rounded-2xl w-36 h-36"
                                />
                                <h3 className="text-lg text-gray-900 font-semibold">
                                    {product.name}
                                </h3>
                                <p className="text-gray-800">
                                    R${Number(product.price).toFixed(2)}{" "}
                                    {product.discount ? (
                                        <span className="text-red-500">
                                            (-{product.discount}%)
                                        </span>
                                    ) : null}
                                </p>
                                <div className="text-sm text-gray-600 mt-1">
                                    Stock: {product.stockQuantity || 'N/A'}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    Weight: {product.weight} {product.unit}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    {product.description}
                                </div>
                                {product.promotionEnd && (
                                    <div className="text-sm text-gray-600 mt-1">
                                        Promotion ends:{" "}
                                        {new Date(product.promotionEnd).toLocaleDateString()}
                                    </div>
                                )}
                                <div className="flex space-x-3 mt-3">
                                    <button
                                        className="flex items-center bg-black-50 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                        onClick={() => handleEditProduct(product)}
                                    >
                                        <EditIcon className="w-5 h-5 mr-2 !text-gray-200" /> Editar
                                    </button>
                                    <button
                                        className="flex items-center bg-gray-600 hover:bg-black-300 text-white font-bold py-2 px-4 rounded"
                                        onClick={() => handleDeleteProduct(product.id)}
                                    >
                                        <Trash2Icon className="w-5 h-5 mr-2 !text-gray-200" /> Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* MODAL */}
            <CreateProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateOrUpdateProduct}
                editingProduct={editingProduct} // Pass the editing product to the modal
            />
        </div>
    );
};

export default Products;
