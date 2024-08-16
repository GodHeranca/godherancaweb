// ImageComponent.js
import React from 'react';

interface ImageComponentProps {
    imageUrl: string | null;
    onImageUpload: (file: File) => void;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ imageUrl, onImageUpload }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageUpload(file); // Pass the selected image to the parent component
        }
    };

    return (
        <div className="image-component">
            {imageUrl ? (
                <img src={imageUrl} alt="Profile" className="profile-image" />
            ) : (
                <p>No image available</p>
            )}
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="image-upload-input"
            />
        </div>
    );
};

export default ImageComponent;
