"use client";
import React, { useState, useEffect } from "react";
import { useItem, Item } from "../context/ItemContext";
import { useSupermarket } from "../context/SupermarketContext";
import { useCategory } from "../context/CategoryContext";

interface CreateProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingProduct: Item | null;
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({ isOpen, onClose, editingProduct }) => {
    const { supermarketId } = useSupermarket();
    const [productData, setProductData] = useState<Omit<Item, '_id' | 'discountedPrice'>>({
        category: "",
        name: "",
        image: "",
        price: 0,
        // discountedPrice: 0,
        description: "",
        weight: 0,
        stockQuantity: 0,
        unit: "",
        discount: 0,
        promotionEnd: undefined,
        supermarket: supermarketId || "",
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const { createItem, updateItem } = useItem();
    const { categories, fetchCategories } = useCategory();

    useEffect(() => {
        if (supermarketId) {
            setProductData((prev) => ({
                ...prev,
                supermarket: supermarketId,
                ...(editingProduct ? {
                    category: editingProduct.category || "",
                    name: editingProduct.name,
                    image: editingProduct.image || "",
                    price: editingProduct.price,
                    discountedPrice: editingProduct.discountedPrice || 0,
                    description: editingProduct.description || "",
                    weight: editingProduct.weight || 0,
                    stockQuantity: editingProduct.stockQuantity || 0,
                    unit: editingProduct.unit || "",
                    discount: editingProduct.discount || 0,
                    promotionEnd: editingProduct.promotionEnd ? new Date(editingProduct.promotionEnd) : undefined,
                } : {})
            }));
            setImageFile(null);
        }
    }, [supermarketId, editingProduct]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        const now = new Date();
        const promotionActive = productData.promotionEnd && new Date(productData.promotionEnd) >= now;

        if (promotionActive && productData.discount) {
            const discountedPrice = productData.price * (1 - productData.discount / 100);
            setProductData((prev) => ({ ...prev, discountedPrice }));
        } else {
            setProductData((prev) => ({ ...prev, discountedPrice: productData.price }));
        }
    }, [productData.price, productData.discount, productData.promotionEnd]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProductData((prev) => ({
            ...prev,
            [name]: name === 'promotionEnd' ? new Date(value) : value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setImageFile(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await updateItem(editingProduct._id, productData, imageFile || undefined);
            } else {
                await createItem(productData, imageFile as File);
            }
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-lg max-w-md w-full" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                <h2 className="text-2xl font-bold mb-6">{editingProduct ? "Edit Product" : "Create Product"}</h2>
                <form onSubmit={handleSubmit}>
                    {/* Form Fields */}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Product Name</label>
                        <input type="text" id="name" name="name" value={productData.name} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="price" className="block text-gray-700 font-bold mb-2">Price</label>
                        <input type="number" id="price" name="price" value={productData.price} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Description</label>
                        <textarea id="description" name="description" value={productData.description} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" rows={3} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="weight" className="block text-gray-700 font-bold mb-2">Weight</label>
                        <input type="number" id="weight" name="weight" value={productData.weight} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="unit" className="block text-gray-700 font-bold mb-2">Unit</label>
                        <input type="text" id="unit" name="unit" value={productData.unit} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="stockQuantity" className="block text-gray-700 font-bold mb-2">Stock Quantity</label>
                        <input type="number" id="stockQuantity" name="stockQuantity" value={productData.stockQuantity} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="discount" className="block text-gray-700 font-bold mb-2">Discount (%)</label>
                        <input type="number" id="discount" name="discount" value={productData.discount || 0} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="promotionEnd" className="block text-gray-700 font-bold mb-2">Promotion End Date</label>
                        <input type="date" id="promotionEnd" name="promotionEnd" value={productData.promotionEnd ? (productData.promotionEnd as Date).toISOString().split("T")[0] : ""} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="category" className="block text-gray-700 font-bold mb-2">Category</label>
                        <select id="category" name="category" value={productData.category} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" required>
                            <option value="">Select a category</option>
                            {categories.map(category => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="supermarket" className="block text-gray-700 font-bold mb-2">Supermarket ID</label>
                        <input type="text" id="supermarket" name="supermarket" value={productData.supermarket} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" readOnly />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="image" className="block text-gray-700 font-bold mb-2">Product Image</label>
                        <input type="file" id="image" name="image" onChange={handleFileChange} className="w-full p-2 border border-gray-300 rounded" />
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Save</button>
                        <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProductModal;
