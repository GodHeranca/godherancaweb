"use client";
import { useState } from 'react';
import axios from 'axios'; // Import axios
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Define the form inputs type
interface SignupFormInputs {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    address: string;
    phone: string;
    userType: 'Admin' | 'Driver' | 'Supermarket' | 'Client' | 'Picker';
    profile: string;
}

// Define the validation schema
const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm Password is required'),
    address: Yup.string().required("Address is required"),
    phone: Yup.string().required("Phone is required"),
    userType: Yup.mixed<'Admin' | 'Driver' | 'Supermarket' | 'Client' | 'Picker'>()
        .oneOf(['Admin', 'Driver', 'Supermarket', 'Client', 'Picker'], "Invalid user type")
        .required("User Type is required"),
    profile: Yup.string().required("Profile is required"),
});

const Signup = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<SignupFormInputs>({
        resolver: yupResolver(validationSchema),
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
        try {
            // Ensure address is an array, even if it's a single string
            const addressArray = data.address.split(',').map(addr => addr.trim());

            // Update data to include address as an array
            const registrationData = { ...data, address: addressArray };

            const registrationResponse = await axios.post('http://localhost:8080/auth/register', registrationData);
            if (registrationResponse.status === 201) {
                setSuccess('Registration successful! You can now log in.');
                setError('');
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    setError(`Registration failed: ${err.response.data.message || 'Please try again.'}`);
                } else if (err.request) {
                    setError('No response from the server. Please try again.');
                } else {
                    setError(`Error: ${err.message}`);
                }
            } else if (err instanceof Error) {
                setError(`Error: ${err.message}`);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };



    return (
        <div className="flex justify-center items-start min-h-screen bg-gray-50 pt-12 sm:pt-20">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}
                <form onSubmit={handleSubmit(onSubmit)} method="post">
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
                        <input
                            type="text"
                            id="username"
                            {...register('username')}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                        <input
                            type="email"
                            id="email"
                            {...register('email')}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
                        <input
                            type="password"
                            id="password"
                            {...register('password')}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            {...register('confirmPassword')}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address:</label>
                        <input
                            type="text"
                            id="address"
                            {...register('address')}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone:</label>
                        <input
                            type="text"
                            id="phone"
                            {...register('phone')}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="userType" className="block text-sm font-medium text-gray-700">User Type:</label>
                        <select
                            id="userType"
                            {...register('userType')}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="">Select a type</option>
                            <option value="Admin">Admin</option>
                            <option value="Driver">Driver</option>
                            <option value="Supermarket">Supermarket</option>
                            <option value="Client">Client</option>
                            <option value="Picker">Picker</option>
                        </select>
                        {errors.userType && <p className="text-red-500 text-sm">{errors.userType.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="profile" className="block text-sm font-medium text-gray-700">Profile:</label>
                        <input
                            type="text"
                            id="profile"
                            {...register('profile')}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {errors.profile && <p className="text-red-500 text-sm">{errors.profile.message}</p>}
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Sign Up
                        </button>
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-sm">Already have an account? <Link href="/login" className="text-blue-500 hover:text-blue-600">Login</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
