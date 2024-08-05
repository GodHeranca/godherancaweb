import React, { useState } from 'react';

interface LocationPromptProps {
    onConfirm: () => void;
    onManual: (address: string) => void;
}

const LocationPrompt: React.FC<LocationPromptProps> = ({ onConfirm, onManual }) => {
    const [manualAddress, setManualAddress] = useState('');

    const handleManualInput = () => {
        onManual(manualAddress);
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-2xl shadow-md text-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                <p className="mb-4 text-sm sm:text-base md:text-lg">Para entregar o mais rápido possível, gostaríamos de saber sua localização atual.</p>
                <button
                    className="bg-black text-white px-4 py-2 rounded mb-2 w-full md:w-auto"
                    onClick={onConfirm}
                >
                    Usar Localização Atual
                </button>
                <div className="flex flex-col md:flex-row items-center">
                    <input
                        type="text"
                        placeholder="Digite seu endereço"
                        className="border border-gray-300 rounded-lg px-4 py-2 mb-2 md:mb-0 md:mr-2 w-full"
                        value={manualAddress}
                        onChange={(e) => setManualAddress(e.target.value)}
                    />
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded w-full md:w-auto"
                        onClick={handleManualInput}
                    >
                        Digite Manual
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LocationPrompt;
