import { useState, useEffect } from "react";
import { useLogin } from "../context/LoginContext";
import Image from "next/image";

const ProfileClient = () => {
    const { user, updateUser, updateProfilePicture } = useLogin();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        profilePicture: '',
        address: '',
        phone: '',
        profile: '',
        id: ''
    });
    const [file, setFile] = useState<File | null>(null);
    const [isEditing, setIsEditing] = useState(false); // State to track edit mode

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                profilePicture: user.profilePicture || '',
                address: user.address.join('') || '',
                phone: user.phone || '',
                profile: user.profile || '',
                id: user._id || ''
            });
            setFile(null);
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);

        if (selectedFile) {
            const fileUrl = URL.createObjectURL(selectedFile);
            setFormData(prevState => ({
                ...prevState,
                profilePicture: fileUrl
            }));

            try {
                await updateProfilePicture(selectedFile);
            } catch (error) {
                console.error('Failed to update profile picture:', error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (user) {
            try {
                const data = new FormData();
                data.append('username', formData.username);
                data.append('email', formData.email);
                data.append('address', formData.address);
                data.append('phone', formData.phone);
                data.append('profile', formData.profile);

                await updateUser(data);
                setIsEditing(false); // Close edit mode after successful save
            } catch (error) {
                console.error('Failed to update profile:', error);
            }
        }
    };

    if (!user) return <div>No user data available.</div>;

    return (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-4 w-full h-full border rounded-lg shadow-md">
            <div className="relative w-40 h-40 md:w-60 md:h-60">
                {formData.profilePicture ? (
                    <img
                        src={formData.profilePicture}
                        width={70}
                        height={70}
                        alt="Profile"
                        className="rounded-full w-full h-full object-cover cursor-pointer"
                        onClick={() => document.getElementById('fileInput')?.click()}
                    />
                ) : (
                    <div
                        className="rounded-full w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 cursor-pointer"
                        onClick={() => document.getElementById('fileInput')?.click()}
                    >
                        <Image src='/imageupload.svg' alt="image upload" width={50} height={50} />
                    </div>
                )}
                <input
                    id="fileInput"
                    type="file"
                    name="profilePicture"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            <div className="flex flex-col w-full md:w-2/3 gap-4">
                {isEditing ? (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <label>
                            Username
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="border p-2 rounded w-full"
                                placeholder="Username"
                            />
                        </label>
                        <label>
                            Email
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="border p-2 rounded w-full"
                                placeholder="Email"
                            />
                        </label>
                        <label>
                            Address
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="border p-2 rounded w-full"
                                placeholder="Address"
                            />
                        </label>
                        <label>
                            Phone
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="border p-2 rounded w-full"
                                placeholder="Phone"
                            />
                        </label>
                        <label>
                            Profile
                            <textarea
                                name="profile"
                                value={formData.profile}
                                onChange={handleChange}
                                className="border p-2 rounded w-full"
                                placeholder="Profile"
                            />
                        </label>
                        <div className="flex gap-4">
                            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded w-full md:w-auto">
                                Save Changes
                            </button>
                            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-300 rounded w-full md:w-auto">
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="text-2xl font-bold">{user.username}</div>
                        <div className="text-md">{user.email}</div>
                        <div className="text-md">{user.address}</div>
                        <div className="text-md">{user.phone}</div>
                        <div className="text-md">{user.profile}</div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="mt-4 px-4 py-2 bg-gray-500 text-white hover:bg-black-400 rounded w-full md:w-auto"
                        >
                            Edit Profile
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileClient;
