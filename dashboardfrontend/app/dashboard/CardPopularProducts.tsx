import { ShoppingBag } from "lucide-react";
import React from "react";
import Image from "next/image";
import { items } from "../../data/supermarketData"; // Import items from your data file

const CardPopularProducts = () => {
    // Use static data here instead of fetching from API
    const popularProducts = items.slice(0, 10); // Adjust the number or logic to get popular products

    return (
        <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl pb-16">
            {popularProducts.length === 0 ? (
                <div className="m-5">No products available</div>
            ) : (
                <>
                    <h3 className="text-lg font-semibold px-7 pt-5 pb-2">
                        Products
                    </h3>
                    <hr />
                    <div className="overflow-auto h-full">
                        {popularProducts.map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center justify-between gap-3 px-5 py-7 border-b"
                            >
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        width={48}
                                        height={48}
                                        className="rounded-lg w-14 h-14"
                                    />
                                    <div className="flex flex-col justify-between gap-1">
                                        <div className="font-bold text-gray-700">
                                            {product.name}
                                        </div>
                                        <div className="flex text-sm items-center">
                                            <span className="font-bold text-blue-500 text-xs">
                                                ${product.price.toFixed(2)}
                                            </span>
                                            <span className="mx-2">|</span>
                                            {/* <Rating rating={product.rating || 0} /> */}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-xs flex items-center">
                                    <button className="p-2 rounded-full bg-blue-100 text-blue-600 mr-2">
                                        <ShoppingBag className="w-4 h-4" />
                                    </button>
                                    {Math.round(product.stockQuantity / 1000)}k Sold
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default CardPopularProducts;
