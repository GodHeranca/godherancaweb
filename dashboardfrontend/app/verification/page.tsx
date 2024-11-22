"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useSearchParams } from "next/navigation"; // Use `useSearchParams` in app directory

// Define the form inputs type
interface VerificationFormInputs {
    verificationCode: string;
}

const verificationSchema = Yup.object().shape({
    verificationCode: Yup.string()
        .length(6, "Verification code must be 6 digits")
        .required("Verification code is required"),
});

const VerificationPage = () => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter(); // Access router functionality
    const searchParams = useSearchParams(); // Use `useSearchParams` to get query parameters

    const email = searchParams.get("email"); // Extract email from query params
    console.log("Extracted email:", email); // Debugging line to check if email is being retrieved

    const { register, handleSubmit, formState: { errors, isValid } } = useForm<VerificationFormInputs>({
        resolver: yupResolver(verificationSchema),
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<VerificationFormInputs> = async (data) => {
        console.log("Submitting with data:", { email, verificationCode: data.verificationCode }); // Log data to check email
        try {
            const response = await axios.post('http://localhost:8080/verify', {
                email,
                verificationCode: data.verificationCode,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });


            if (response.status === 200) {
                setSuccess("Account verified successfully!");
                router.push("/login"); // Redirect to login after success
            }
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.message || "Verification failed. Please try again.");
            } else {
                setError("An unexpected error occurred.");
            }
        }
    };

    return (
        <div className="flex justify-center items-start min-h-screen bg-gray-50 pt-12 sm:pt-20 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Verify Your Account</h2>
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}
                <form onSubmit={handleSubmit(onSubmit)} method="post">
                    <div className="mb-4">
                        <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
                            Verification Code:
                        </label>
                        <input
                            type="text"
                            id="verificationCode"
                            {...register("verificationCode", {
                                setValueAs: (value) => value.trim(), // Trim input value
                            })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {errors.verificationCode && <p className="text-red-500 text-sm">{errors.verificationCode.message}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={!isValid}
                        className={`w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${!isValid ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        Verify
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerificationPage;
