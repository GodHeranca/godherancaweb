"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Category } from '../context/CategoryContext';
import { useCategory } from '../context/CategoryContext';
import { useLogin } from '../context/LoginContext';
import CategoryForm from './CategoryModal';
import { useSupermarket } from '../context/SupermarketContext';

const CategoriesPage = () => {
    const { isAuthenticated, user } = useLogin();
    const { categories, createCategory, updateCategory, deleteCategory, fetchCategories } = useCategory();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [parentCategories, setParentCategories] = useState<Category[]>([]);
    const { supermarketId } = useSupermarket();

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            if (isMounted && isAuthenticated && user && supermarketId) {
                try {
                    await fetchCategories();
                } catch (error) {
                    console.error('Error fetching categories:', error);
                    setError('Error fetching categories. Please try again later.');
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [isAuthenticated, user, supermarketId]);



    useEffect(() => {
        if (categories) {
            setParentCategories(categories.filter(cat => !cat.parentCategory));
        }
    }, [categories]);

    const handleCreate = () => {
        setEditingCategory(undefined);
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

        if (category.parentCategory) {
            formData.append('parentCategory', category.parentCategory);
        }

        try {
            if (editingCategory) {
                await updateCategory(editingCategory._id, formData);
            } else {
                await createCategory(formData);
            }

            await fetchCategories(); // Refresh categories after creation or update

            setIsFormOpen(false); // Close the form after saving successfully
            setEditingCategory(undefined); // Reset editing category
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

                // Update local categories state
                const updatedCategories = categories.filter(category => category._id !== id);
                setParentCategories(updatedCategories);

                // Optionally re-fetch categories
                await fetchCategories();

                // Close the modal if open
                setIsFormOpen(false);
            } catch (error) {
                console.error('Failed to delete category:', error);
                setError('Failed to delete category. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderCategory = (category: Category) => (
        <div key={category._id} className="border shadow rounded-lg p-4 bg-white">
            {category.image && (
                <img
                    src={category.image}
                    alt={category.name}
                    className="w-32 h-32 object-cover rounded-full mx-auto"
                />
            )}
            <h2 className="text-xl font-semibold mt-4 text-center">{category.name}</h2>
            <div className="mt-4 flex justify-around">
                <button
                    onClick={() => handleEdit(category)}
                    className="bg-gray-300 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                    Edit
                </button>
                <button
                    onClick={() => handleDelete(category._id)}
                    className="bg-black-300 text-white px-4 py-2 rounded"
                >
                    Delete
                </button>
            </div>
        </div>
    );

    if (!isAuthenticated || !user) {
        return (
            <p className='text-center justify-center text-black'> You do not have permission to view this page. </p>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 w-1/2"
                />
                <button
                    onClick={handleCreate}
                    className="bg-gray-500 hover:bg-black-300 focus:ring text-white px-4 py-2 rounded"
                >
                    Add Category
                </button>
            </div>
            {/* {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>} */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map(renderCategory)}
            </div>
            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded shadow-lg">
                        <CategoryForm
                            category={editingCategory}
                            onSave={handleSave}
                            onCancel={handleCancel}
                            parentCategories={parentCategories}
                            userId={user?._id || ''}
                            supermarketId={supermarketId || ''} loading={loading} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesPage;
