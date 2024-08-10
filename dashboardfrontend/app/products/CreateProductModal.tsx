"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { v4 } from "uuid";
import { Item } from "@/data/supermarketType";

type CreateProductModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (formData: Item) => void;
    editingProduct?: Item | null;
};

const CreateProductModal = ({
    isOpen,
    onClose,
    onCreate,
    editingProduct = null,
}: CreateProductModalProps) => {
    const [formData, setFormData] = useState<Item>({
        id: "",
        categoryId: 1,
        name: "",
        image: "",
        price: 0,
        description: "",
        weight: 0,
        stockQuantity: 0,
        unit: "",
        discount: 0,
        promotionEnd: undefined,
    });

    useEffect(() => {
        if (editingProduct) {
            setFormData(editingProduct);
        } else {
            setFormData({
                id: v4(),
                categoryId: 1,
                name: "",
                image: "",
                price: 0,
                description: "",
                weight: 0,
                stockQuantity: 0,
                unit: "",
                discount: 0,
                promotionEnd: undefined,
            });
        }
    }, [editingProduct, isOpen]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    image: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onCreate(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md p-6 rounded shadow-lg overflow-y-auto max-h-[90vh]">
                <h2 className="text-2xl mb-4">
                    {editingProduct ? "Edit Product" : "Create Product"}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded-md p-2"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="price" className="block text-sm font-medium">
                            Price
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded-md p-2"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="stockQuantity" className="block text-sm font-medium">
                            Stock Quantity
                        </label>
                        <input
                            type="number"
                            id="stockQuantity"
                            name="stockQuantity"
                            value={formData.stockQuantity}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded-md p-2"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="weight" className="block text-sm font-medium">
                            Weight
                        </label>
                        <input
                            type="number"
                            id="weight"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded-md p-2"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="unit" className="block text-sm font-medium">
                            Unit
                        </label>
                        <input
                            type="text"
                            id="unit"
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded-md p-2"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded-md p-2"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="image" className="block text-sm font-medium">
                            Image Upload
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="mt-1 block w-full border rounded-md p-2"
                            required
                        />
                        {formData.image && (
                            <img
                                src={formData.image}
                                alt="Product Preview"
                                className="mt-4 h-32 w-32 object-cover"
                            />
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="discount" className="block text-sm font-medium">
                            Discount (%)
                        </label>
                        <input
                            type="number"
                            id="discount"
                            name="discount"
                            value={formData.discount}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded-md p-2"
                            min="0"
                            max="100"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="promotionEnd" className="block text-sm font-medium">
                            Promotion End Date
                        </label>
                        <input
                            type="date"
                            id="promotionEnd"
                            name="promotionEnd"
                            value={
                                formData.promotionEnd
                                    ? new Date(formData.promotionEnd).toISOString().split("T")[0]
                                    : ""
                            }
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded-md p-2"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded mr-2"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            {editingProduct ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProductModal;
