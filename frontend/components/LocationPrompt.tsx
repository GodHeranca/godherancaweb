import { Autocomplete } from '@react-google-maps/api';
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import Image from 'next/legacy/image';

interface LocationPromptProps {
    onConfirm: () => void;
    onManual: (address: string) => void;
    onAddressChange: Dispatch<SetStateAction<string | null>>;
}

const LocationPrompt: React.FC<LocationPromptProps> = ({ onConfirm, onManual, onAddressChange }) => {
    const [manualAddress, setManualAddress] = useState('');
    const [showManualInput, setShowManualInput] = useState(false);
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

    const onLoad = useCallback((autoC: google.maps.places.Autocomplete) => {
        setAutocomplete(autoC);
    }, []);

    const onPlaceChanged = useCallback(() => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (place.formatted_address) {
                onAddressChange(place.formatted_address);
                setManualAddress(place.formatted_address);
            }
        }
    }, [autocomplete, onAddressChange]);

    const handleManualInput = () => {
        onManual(manualAddress);
        setShowManualInput(false); // Hide the modal after confirming
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden'; // Disable body scroll when the prompt is open

        return () => {
            document.body.style.overflow = ''; // Re-enable body scroll on cleanup
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-2xl shadow-md text-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg z-50">
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
                    <div className="bg-white p-6 rounded-2xl shadow-md text-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg z-50">
                        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                            <input
                                type="text"
                                placeholder="Digite seu endereço"
                                className="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-full text-black"
                                value={manualAddress}
                                onChange={(e) => setManualAddress(e.target.value)}
                            />
                        </Autocomplete>
                        <button
                            className="bg-gray-400 hover:bg-black text-white px-4 py-2 rounded w-full"
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
