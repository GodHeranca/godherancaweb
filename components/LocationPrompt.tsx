import React, { useState, useEffect } from 'react';
import Image from 'next/legacy/image';

interface LocationPromptProps {
    onConfirm: () => void;
    onManual: (address: string) => void;
    onAddressChange: (address: string | null) => void;
}

const LocationPrompt: React.FC<LocationPromptProps> = ({ onConfirm, onManual, onAddressChange }) => {
    const [manualAddress, setManualAddress] = useState('');
    const [showManualInput, setShowManualInput] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY || '';

    useEffect(() => {
        if (manualAddress) {
            fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(manualAddress)}.json?access_token=${mapboxToken}`)
                .then(response => response.json())
                .then(data => {
                    if (data.features) {
                        const newSuggestions = data.features.map((feature: any) => feature.place_name);
                        setSuggestions(newSuggestions);
                    }
                })
                .catch(() => {
                    setSuggestions([]);
                });
        } else {
            setSuggestions([]);
        }
    }, [manualAddress]);

    const handleManualInput = () => {
        if (manualAddress) {
            onManual(manualAddress);
            setShowManualInput(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setManualAddress(suggestion);
        setSelectedSuggestion(suggestion);
        setSuggestions([]);
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-2xl shadow-md text-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
                        <Image src="/location.svg" alt="Location" width={50} height={50} className="object-contain" />
                    </div>
                    <p className="mb-4 text-sm sm:text-base md:text-lg text-black">
                        Para entregar o mais rápido possível, gostaríamos de saber sua localização atual.
                    </p>
                </div>
                <div className="flex flex-col md:flex-row justify-center items-center md:space-x-4">
                    <button
                        className="bg-black text-white px-4 py-2 rounded mb-4 md:mb-0 w-full md:w-auto"
                        onClick={onConfirm}
                    >
                        Usar Localização Atual
                    </button>
                    <button
                        className="bg-gray-600 text-white px-4 py-2 rounded w-full md:w-auto"
                        onClick={() => setShowManualInput(true)}
                    >
                        Digite Manual
                    </button>
                </div>
            </div>

            {showManualInput && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-md text-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                        <input
                            type="text"
                            placeholder="Digite seu endereço"
                            className="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-full text-black"
                            value={manualAddress}
                            onChange={(e) => setManualAddress(e.target.value)}
                        />
                        {suggestions.length > 0 && (
                            <ul className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
                                {suggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        className={`p-2 cursor-pointer ${selectedSuggestion === suggestion ? 'bg-gray-200' : ''}`}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <button
                            className="bg-gray-400 hover:bg-black text-white px-4 py-2 rounded w-full mt-4"
                            onClick={handleManualInput}
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationPrompt;
