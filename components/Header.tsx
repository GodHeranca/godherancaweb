'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearch } from '@/context/SearchContext';
import LocationPrompt from './LocationPrompt';
import useGoogleMapsLoader from '@/hook/GoogleMap';

interface HeaderProps {
    setUserLocation: (location: { lat: number; lon: number }) => void;
}

const api = 'AIzaSyASXMx9-yGdgyJNv0gNI8nUdaoRxlkRU1A';

const Header: React.FC<HeaderProps> = ({ setUserLocation }) => {
    const { searchQuery, setSearchQuery } = useSearch();
    const [showPrompt, setShowPrompt] = useState(true);
    const [address, setAddress] = useState<string | null>(null);
    const [loading, setLoading] = useState(true); // New loading state
    const isGoogleMapsLoaded = useGoogleMapsLoader(api as string);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        if (!showPrompt && isGoogleMapsLoaded) {
            getLocation();
        }
    }, [showPrompt, isGoogleMapsLoaded]);

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
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert('User denied the request for Geolocation.');
                break;
            case error.POSITION_UNAVAILABLE:
                alert('Location information is unavailable.');
                break;
            case error.TIMEOUT:
                alert('The request to get user location timed out.');
                break;
            default:
                alert('An unknown error occurred.');
                break;
        }
        setLoading(false); // Set loading to false if error occurs
    };

    const manualLocation = () => {
        const manualAddress = prompt('Please enter your address manually:');
        if (manualAddress) {
            geocodeAddress(manualAddress);
        }
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
                console.log(`Address set to: ${results[0].formatted_address}`);
            } else {
                alert('No results found for the provided address.');
                console.error('Geocode error:', status, results);
            }
            setLoading(false); // Set loading to false after geocoding
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
                setAddress(results[0].formatted_address);
            } else {
                alert('No results found for the given location.');
                console.error('Geocode error:', status, results);
            }
            setLoading(false); // Set loading to false after reverse geocoding
        });
    };

    const handleConfirmLocation = () => {
        setShowPrompt(false);
        setLoading(true); // Start loading when location confirmation begins
    };

    const handleManualLocation = () => {
        setShowPrompt(false);
        manualLocation();
        setLoading(true); // Start loading when manual location is used
    };

    return (
        <nav className='bg-white p-4'>
            <div className='flex items-center justify-between max-w-6xl mx-auto'>
                <a href='/'>
                    <div className='flex items-start flex-shrink-0'>
                        <Image src='/logo.svg' alt='Logo' width={80} height={80} />
                    </div>
                </a>
                <div className='flex items-center flex-1 mx-8'>
                    <div className='flex items-center space-x-2 flex-shrink-0'>
                        {address && <span className='truncate w-40'>{address}</span>}
                        <button onClick={() => setShowPrompt(true)} className='bg-white text-white px-4 py-2 rounded'>
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
                            className='border-none outline-none px-4 py-2 flex-grow text-lg'
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>
                <div className='flex items-center flex-shrink-0'>
                    <a href='#' className='text-black px-4 py-2'>
                        Sobre Nós
                    </a>
                </div>
            </div>

            {showPrompt && (
                <LocationPrompt
                    onConfirm={handleConfirmLocation}
                    onManual={handleManualLocation}
                />
            )}
        </nav>
    );
};


export default Header;
