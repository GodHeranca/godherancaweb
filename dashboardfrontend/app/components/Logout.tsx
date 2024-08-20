// LogoutButton.tsx
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { clearUser } from '../state/authSlice'; // Adjust the path accordingly

const Logout = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogout = async () => {
        // Perform any additional logout logic here if needed, such as invalidating a session token
        dispatch(clearUser()); // Clear user data from Redux store
        router.push('/login'); // Redirect to login page after logout
    };

    return (
        <button
            onClick={handleLogout}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
            Logout
        </button>
    );
};

export default Logout;
