"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface LocationPromptProps {
    onConfirm: () => void;
    onManual: () => void;
}

const LocationPrompt: React.FC<LocationPromptProps> = ({ onConfirm, onManual }) => {
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-md text-center">
                <p className="mb-4">Para entregar o mais rápido possível, gostaríamos de saber sua localização atual.</p>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    onClick={onConfirm}
                >
                    Usar Localização Atual
                </button>
                <button
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={onManual}
                >
                    Digite Manual
                </button>
            </div>
        </div>
    );
};

const Header: React.FC = () => {
    const [showPrompt, setShowPrompt] = useState(true);
    const [address, setAddress] = useState<string | null>(null);

    useEffect(() => {
        if (!showPrompt) {
            getLocation();
        }
    }, [showPrompt]);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, handleError);
        } else {
            alert('Geolocalização não é suportada por este navegador.');
        }
    };

    const showPosition = (position: GeolocationPosition) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setAddress(`Latitude: ${latitude}, Longitude: ${longitude}`);
        // Here you could also call an API to get the address based on the latitude and longitude
    };

    const handleError = (error: GeolocationPositionError) => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert('Usuário negou o pedido de Geolocalização.');
                manualLocation();
                break;
            case error.POSITION_UNAVAILABLE:
                alert('Informações de localização não disponíveis.');
                manualLocation();
                break;
            case error.TIMEOUT:
                alert('O pedido para obter a localização do usuário expirou.');
                manualLocation();
                break;
            default:
                alert('Ocorreu um erro desconhecido.');
                manualLocation();
                break;
        }
    };

    const manualLocation = () => {
        const manualLocation = prompt('Por favor, insira sua localização manualmente:');
        if (manualLocation) {
            setAddress(manualLocation);
        }
    };

    const handleConfirm = () => {
        setShowPrompt(false);
    };

    const handleManual = () => {
        setShowPrompt(false);
        manualLocation();
    };

    return (
        <nav className='bg-white p-4'>
            {showPrompt && <LocationPrompt onConfirm={handleConfirm} onManual={handleManual} />}
            <div className='flex items-center justify-between max-w-6xl mx-auto'>
                <a href='/'>
                    <div className='flex items-center flex-shrink-0'>
                        <Image src='/G.png' alt='Profile Picture' width={40} height={40} />
                    </div>
                </a>
                <div className='flex items-center flex-1 mx-8'>
                    <div className='flex items-center space-x-2 flex-shrink-0'>
                        {address &&
                            <span className='truncate w-40'>{address}</span>
                        }
                        <button className='bg-white text-white px-4 py-2 rounded'>
                            <Image src='/dropdown.png' alt='Dropdown' width={25} height={25} />
                        </button>
                    </div>
                    <div className='flex items-center border border-gray-300 rounded-md px-2 w-full ml-4'>
                        <button className='p-1'>
                            <Image src='/search.png' alt='Search' width={20} height={20} />
                        </button>
                        <input
                            type='text'
                            placeholder='Search...'
                            className='border-none outline-none px-4 py-2 flex-grow text-lg'
                        />
                    </div>
                </div>
                <div className='flex items-center flex-shrink-0'>
                    <a href="#" className='text-black px-4 py-2'>
                        Sobre Nós
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Header;
