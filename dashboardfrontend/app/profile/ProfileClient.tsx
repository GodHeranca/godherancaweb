import { useState, useEffect } from "react";
import { useLogin } from "../LoginContext"; // Ensure the path is correct

const ProfileClient = () => {
    const { user, updateUser } = useLogin(); // Correct function name
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        profilePicture: '',
        address: '', // Expecting a single string
        phone: '',
        profile: ''
    });
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                profilePicture: user.profilePicture || '', // Initially, it's the URL
                address: user.address?.join(', ') || '', // Convert array to string for formData
                phone: user.phone || '',
                profile: user.profile || ''
            });
            setFile(null); // Reset file state when user data is loaded
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);

        if (selectedFile) {
            // Create a preview URL for the selected file
            const fileUrl = URL.createObjectURL(selectedFile);
            setFormData(prevState => ({
                ...prevState,
                profilePicture: fileUrl // Use the preview URL for display purposes
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            const data = new FormData();
            data.append('username', formData.username);
            data.append('email', formData.email);
            data.append('address', formData.address); // Ensure address is a string
            data.append('phone', formData.phone);
            data.append('profile', formData.profile);

            if (file) {
                data.append('profilePicture', file); // Append the new file if selected
            }

            try {
                await updateUser(data); // Call the updateUser function
                setIsEditing(false);
            } catch (error) {
                console.error('Failed to update profile:', error);
            }
        }
    };

    if (!user) return <div>No user data available.</div>;

    return (
        <div className="flex flex-col justify-center gap-8 p-4 w-full h-full border rounded-lg shadow-md">
            <div className="flex justify-center w-full">
                <img
                    src={formData.profilePicture} // Default image if none is set
                    alt="Profile"
                    className="rounded-full w-40 h-40 object-cover"
                />
            </div>

            {isEditing ? (
                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        placeholder="Username"
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        placeholder="Email"
                    />
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        placeholder="Address"
                    />
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        placeholder="Phone"
                    />
                    <textarea
                        name="profile"
                        value={formData.profile}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        placeholder="Profile"
                    />
                    <input
                        type="file"
                        name="profilePicture"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="border p-2 rounded"
                    />
                    <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                        Save Changes
                    </button>
                    <button type="button" onClick={() => setIsEditing(false)} className="mt-2 px-4 py-2 bg-gray-300 rounded">
                        Cancel
                    </button>
                </form>
            ) : (
                <div className="flex flex-col w-full items-center gap-8">
                    <div className="text-xl font-bold">{user.username}</div>
                    <div className="text-md">{user.email}</div>
                    <div className="text-md">{user.address}</div>
                    <div className="text-md">{user.phone}</div>
                    <div className="text-md">{user.profile}</div>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Edit Profile
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileClient;
