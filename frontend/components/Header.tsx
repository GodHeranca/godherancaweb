'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearch } from '@/context/SearchContext';
import dynamic from 'next/dynamic';
import { LoadScript, Libraries } from '@react-google-maps/api';

const LocationPrompt = dynamic(() => import('./LocationPrompt'), { ssr: false });

interface HeaderProps {
    setUserLocation: (location: { lat: number; lon: number }) => void;
}

const libraries: Libraries = ["places"];

const Header: React.FC<HeaderProps> = ({ setUserLocation }) => {
    const { searchQuery, setSearchQuery } = useSearch();
    const [showPrompt, setShowPrompt] = useState(false);
    const [address, setAddress] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const promptShown = localStorage.getItem('promptShown');
        const storedAddress = localStorage.getItem('userAddress');

        if (storedAddress) {
            setAddress(storedAddress);
        }

        if (!promptShown && !storedAddress) {
            setShowPrompt(true);
        }
    }, []);

    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, handleError);
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    const showPosition = (position: GeolocationPosition) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setUserLocation({ lat: latitude, lon: longitude });
        reverseGeocodeAddress(latitude, longitude);
    };

    const handleError = (error: GeolocationPositionError) => {
        console.error('Geolocation error', error);
        setLoading(false);
    };

    const manualLocation = (manualAddress: string) => {
        geocodeAddress(manualAddress);
    };

    const geocodeAddress = (address: string) => {
        if (!window.google) {
            alert('Google Maps API is not loaded.');
            return;
        }

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                const location = results[0].geometry.location;
                setUserLocation({ lat: location.lat(), lon: location.lng() });
                setAddress(results[0].formatted_address);
                localStorage.setItem('userAddress', results[0].formatted_address);
            } else {
                alert('Geocode was not successful.');
            }
            setLoading(false);
        });
    };

    const reverseGeocodeAddress = (lat: number, lon: number) => {
        if (!window.google) {
            alert('Google Maps API is not loaded.');
            return;
        }

        const geocoder = new google.maps.Geocoder();
        const latlng = new google.maps.LatLng(lat, lon);
        geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                const formattedAddress = results[0].formatted_address;
                setAddress(formattedAddress);
                localStorage.setItem('userAddress', formattedAddress);
            } else {
                alert('No results found for the given location.');
            }
            setLoading(false);
        });
    };

    const handleConfirmLocation = () => {
        setShowPrompt(false);
        setLoading(true);
        getLocation();
        localStorage.setItem('promptShown', 'true');
    };

    const handleManualLocation = (address: string) => {
        setShowPrompt(false);
        manualLocation(address);
        setLoading(true);
        localStorage.setItem('promptShown', 'true');
    };

    return (
        isClient ? (
            <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries}>
                <nav className='bg-white p-4'>
                    <div className='flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto'>
                        <a href='/'>
                            <div className='flex items-start flex-shrink-0'>
                                <Image src='/logo.svg' alt='Logo' width={80} height={80} />
                            </div>
                        </a>
                        <div className='flex flex-col md:flex-row items-center flex-1 mx-8 mt-4 md:mt-0 text-black'>
                            <div className='flex items-center space-x-2 flex-shrink-0'>
                                {address && <span className='truncate w-40 text-black'>{address}</span>}
                                <button onClick={() => setShowPrompt(true)} className='bg-white text-black px-4 py-2 rounded'>
                                    <Image src='/dropdown.png' alt='Dropdown' width={25} height={25} />
                                </button>
                            </div>
                            <div className='flex items-center border border-gray-300 rounded-xl px-2 w-full ml-4'>
                                <button className='p-1'>
                                    <Image src='/search.png' alt='Search' width={20} height={20} />
                                </button>
                                <input
                                    type='text'
                                    placeholder='Procure supermercados atacadistas...'
                                    className='border-none outline-none px-4 py-2 flex-grow text-lg text-black'
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div>
                        <div className='flex items-center flex-shrink-0 mt-4 md:mt-0'>
                            <a href='#' className='text-black px-4 py-2'>
                                Sobre Nos
                            </a>
                        </div>
                    </div>

                    {showPrompt && (
                        <LocationPrompt
                            onConfirm={handleConfirmLocation}
                            onManual={handleManualLocation}
                            onAddressChange={setAddress}
                        />
                    )}
                    {loading && (
                        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-50 bg-opacity-75 flex items-center justify-center">
                            <p>Loading...</p>
                        </div>
                    )}
                </nav>
            </LoadScript>
        ) : null
    );
};

export default Header;
