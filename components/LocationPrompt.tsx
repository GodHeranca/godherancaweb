import React from 'react';

interface LocationPromptProps {
    onConfirm: () => void;
    onManual: () => void;
}

const LocationPrompt: React.FC<LocationPromptProps> = ({ onConfirm, onManual }) => {
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
                <p className="mb-4">Para entregar o mais rápido possível, gostaríamos de saber sua localização atual.</p>
                <button
                    className="bg-black text-white px-4 py-2 rounded mr-2"
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

export default LocationPrompt;
