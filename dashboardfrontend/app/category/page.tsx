"use client";
import React, { useState } from 'react';
import { useCategory, Category } from '../context/CategoryContext';
import { useLogin } from '../context/LoginContext';
import CategoryForm from './CategoryModal';

const CategoriesPage = () => {
    const { isAuthenticated } = useLogin();
    const { categories, createCategory, updateCategory, deleteCategory } = useCategory();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreate = () => {
        setEditingCategory(null);
        setIsFormOpen(true);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsFormOpen(true);
    };

    const handleSave = async (category: Omit<Category, '_id'>, imageFile?: File) => {
        setLoading(true);
        setError(null);
        const formData = new FormData();
        formData.append('name', category.name);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            if (editingCategory) {
                await updateCategory(editingCategory._id, formData);
            } else {
                await createCategory(formData);
            }
            setIsFormOpen(false);
        } catch (error) {
            console.error('Failed to save category:', error);
            setError('Failed to save category. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsFormOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            setLoading(true);
            setError(null);
            try {
                await deleteCategory(id);
            } catch (error) {
                console.error('Failed to delete category:', error);
                setError('Failed to delete category. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-center text-red-500 text-xl">You must be logged in to view this page.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-screen-lg">
            <h1 className="text-3xl font-bold mb-6">Categories</h1>
            <button
                onClick={handleCreate}
                className="bg-black-300 text-white px-4 py-2 rounded-lg mb-4 hover:bg-blue-700 transition"
                disabled={loading}
            >
                Add Category
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <div key={category._id} className="border shadow rounded-lg p-4 bg-white">
                        {category.image && (
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-32 h-32 object-cover rounded-full mx-auto"
                            />
                        )}
                        <h2 className="text-xl font-semibold mt-4 text-center">{category.name}</h2>
                        <div className="mt-4 flex justify-between">
                            <button
                                onClick={() => handleEdit(category)}
                                className="bg-gray-300 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                                disabled={loading}
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(category._id)}
                                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
                                disabled={loading}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {error && <p className="text-red-500 text-center mt-4 text-lg">{error}</p>}

            {isFormOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <CategoryForm
                            category={editingCategory || undefined}
                            onSave={handleSave}
                            onCancel={handleCancel}
                        />
                        {loading && <p className="text-center mt-4 text-blue-600">Saving...</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesPage;
