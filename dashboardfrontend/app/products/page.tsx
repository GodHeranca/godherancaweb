"use client";
import { PlusCircleIcon, Trash2Icon, EditIcon } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import CreateProductModal from "./CreateProductModal";
import Image from "next/image";
import { useItem, Item } from '../context/ItemContext';
import { useLogin } from '../context/LoginContext';
import { useRouter } from "next/navigation";
import { useSupermarket } from '../context/SupermarketContext';

const Products = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Item | null>(null);

    const { items, deleteItem, fetchItemsBySupermarket } = useItem();
    const { isAuthenticated, user } = useLogin();
    const { supermarketId } = useSupermarket();
    const router = useRouter();

    const fetchItems = useCallback(async () => {
        if (supermarketId) {
            await fetchItemsBySupermarket();
        } else {
            console.warn('supermarketId is undefined');
        }
    }, [fetchItemsBySupermarket, supermarketId]);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            if (isAuthenticated && supermarketId) {
                await fetchItems();
            }
        };

        fetchData().finally(() => {
            if (isMounted) {
                // Set any additional state if needed
            }
        });

        return () => {
            isMounted = false;
        };
    }, [isAuthenticated, supermarketId, fetchItems]);

    if (!isAuthenticated || !user) {
        return <p className="text-center text-gray-600">Loading...</p>;
    }

    // Filter products based on the search term
    const filteredProducts = items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditProduct = (product: Item) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteProduct = async (productId: string) => {
        try {
            await deleteItem(productId);
        } catch (error) {
            console.error("Failed to delete product:", error);
        }
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            {/* SEARCH BAR */}
            <div className="mb-6 flex justify-center">
                <input
                    className="w-full max-w-lg py-2 px-4 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search products..."
                    value={searchTerm} // Ensure value is never undefined
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* HEADER BAR */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Products</h2>
                <button
                    className="flex items-center bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg"
                    onClick={() => {
                        setEditingProduct(null); // Clear editing state when creating a new product
                        setIsModalOpen(true);
                    }}
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2" /> Create Product
                </button>
            </div>

            {/* BODY PRODUCTS LIST */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredProducts.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500">No products found</div>
                ) : (
                    filteredProducts.map((product) => {
                        const isPromotionActive = product.promotionEnd && new Date(product.promotionEnd) >= new Date();
                        const displayPrice = isPromotionActive && product.discount
                            ? product.price * (1 - (product.discount / 100))
                            : product.price;

                        return (
                            <div
                                key={product._id}
                                className="border rounded-lg shadow-lg bg-white p-4 flex flex-col items-center"
                            >
                                <Image
                                    src={product.image || '/default-image.png'}
                                    alt={product.name}
                                    width={80}
                                    height={80}
                                    className="mb-4 rounded-3xl w-32 h-32 object-cover"
                                />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                                    {product.name}
                                </h3>
                                <div className="text-lg font-medium text-gray-800 mb-2">
                                    {product.discount && isPromotionActive ? (
                                        <>
                                            <span className="line-through text-gray-500">${Number(product.price).toFixed(2)}</span>{" "}
                                            <span className="text-red-500">${Number(displayPrice).toFixed(2)}</span>
                                        </>
                                    ) : (
                                        <span>${Number(displayPrice).toFixed(2)}</span>
                                    )}
                                </div>
                                {product.quantityOffers && product.quantityOffers.length > 0 && (
                                    <div className="text-sm text-gray-600 mb-2">
                                        {product.quantityOffers.map((offer, index) => (
                                            <div key={index}>
                                                Offer: Buy {offer.quantity} or more for ${Number(offer.price).toFixed(2)} each
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="text-sm text-gray-600 mb-2">
                                    Stock: {product.stockQuantity || 'N/A'}
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                    Weight: {product.weight} {product.unit}
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                    {product.description}
                                </div>
                                {product.promotionEnd && (
                                    <div className="text-sm text-gray-600 mb-4">
                                        Promotion ends:{" "}
                                        {(new Date(product.promotionEnd)).toLocaleDateString()}
                                    </div>
                                )}
                                <div className="flex space-x-3">
                                    <button
                                        className="flex items-center bg-gray-400 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
                                        onClick={() => handleEditProduct(product)}
                                    >
                                        <EditIcon className="w-5 h-5 mr-2" /> Edit
                                    </button>
                                    <button
                                        className="flex items-center bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-lg"
                                        onClick={() => handleDeleteProduct(product._id)}
                                    >
                                        <Trash2Icon className="w-5 h-5 mr-2" /> Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* MODAL */}
            <CreateProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingProduct={editingProduct}
            />
        </div>
    );
};

export default Products;
