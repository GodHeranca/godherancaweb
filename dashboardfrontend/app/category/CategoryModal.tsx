import React, { useState, useEffect } from 'react';
import { Category } from '../context/CategoryContext';

interface CategoryFormProps {
    category?: Category;
    onSave: (category: Omit<Category, 'id'>, imageFile?: File) => void;
    onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSave, onCancel }) => {
    const [name, setName] = useState(category?.name || '');
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        if (category) {
            setName(category.name);
        }
    }, [category]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            name,
            _id: '',
            userId: '',
            supermarketId: '' // Ensure this gets filled in
        }, imageFile || undefined); // Use undefined if imageFile is null
    };



    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-gray-700">Category Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 w-full"
                    required
                />
            </div>
            <div>
                <label className="block text-gray-700">Upload Image</label>
                <input
                    type="file"
                    onChange={handleImageChange}
                    className="border p-2 w-full"
                    accept="image/*"
                />
                {imageFile && <p className="mt-2">Selected file: {imageFile.name}</p>}
            </div>
            <div className="flex space-x-4">
                <button type="submit" className="bg-black-500 text-white px-4 py-2 rounded">
                    Save
                </button>
                <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default CategoryForm;