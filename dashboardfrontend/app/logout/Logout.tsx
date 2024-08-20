import { useDispatch } from 'react-redux';
import { clearUser } from '../state/authSlice';
import { useRouter } from 'next/router';

const Logout = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogout = () => {
        dispatch(clearUser());
        router.push('/'); // Redirect to home after logout
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default Logout;
