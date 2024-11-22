"use client"
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useLogin } from '../context/LoginContext';
import { useDispatch } from 'react-redux';
import { setUser, setToken, clearUser, clearToken } from '../state/authSlice';
import Link from 'next/link';
import { GoogleLogin } from '@react-oauth/google'; // Import GoogleLogin component

const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const { login } = useLogin();
    const router = useRouter();
    const dispatch = useDispatch();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    useEffect(() => {
        const resetTimeout = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                dispatch(clearUser());
                dispatch(clearToken());
                router.push('/login');
            }, 15 * 60 * 1000);
        };

        window.addEventListener('mousemove', resetTimeout);
        window.addEventListener('keydown', resetTimeout);
        resetTimeout();

        return () => {
            window.removeEventListener('mousemove', resetTimeout);
            window.removeEventListener('keydown', resetTimeout);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [dispatch, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 401) {
                    throw new Error('Invalid email or password');
                } else {
                    throw new Error(errorData.message || 'Login failed');
                }
            }

            const data = await response.json();

            await login(email, password);
            dispatch(setUser(data.user));
            dispatch(setToken(data.token));

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            router.push('/inventory');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    // Frontend Google login route (ensure it matches your backend)
    const handleGoogleSuccess = async (response: any) => {
        try {
            const { credential } = response;
            const googleResponse = await fetch('http://localhost:8080/oauth/google/callback', { // Adjusted to /oauth
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: credential }),
            });

            if (!googleResponse.ok) {
                throw new Error('Google sign-in failed');
            }

            const data = await googleResponse.json();
            dispatch(setUser(data.user));
            dispatch(setToken(data.token));
            router.push('/inventory');
        } catch (error) {
            console.error(error);
            setError('An error occurred during Google sign-in');
        }
    };


    return (
        <div className="flex justify-center items-start min-h-screen bg-white">
            <div className="p-8 rounded-lg shadow-md w-full max-w-md bg-white dark:bg-gray-800 mt-10">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            className={`mt-1 block w-full px-3 py-2 border ${error && !validateEmail(email) ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 dark:bg-black-500 hover:bg-black-500 dark:hover:bg-black-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black-400 ${loading || !validateEmail(email) ? 'cursor-not-allowed opacity-50' : ''}`}
                        disabled={loading || !validateEmail(email)}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <div className="mt-4 text-center">
                        <p className="text-sm">You don't have an account? <Link href="/signup" className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300">Sign Up</Link></p>
                    </div>
                </form>
                {/* <div className="mt-6 text-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        // promptMomentNotification={han}
                        // onError={(error: { message: any; }) => setError(error.message || 'An error occurred during Google sign-in')}
                    />
                </div> */}
            </div>
        </div>
    );
};

export default Login;
