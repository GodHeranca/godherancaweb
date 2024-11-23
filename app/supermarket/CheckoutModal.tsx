import React, { useCallback, useState, useEffect } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { Item } from '../../context/SupermarketContext';
import useGoogleMapsLoader from '../../hook/GoogleMap'; // Adjust the path as needed

type CartItem = Item & { quantity: number };

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    cart: Item[];
    customerName: string;
    streetAddress: string;
    note: string;
    paymentMethod: 'Pix' | 'credit-card' | null;
    onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onNoteChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onPaymentMethodChange: (method: 'Pix' | 'credit-card' | null) => void;
    supermarketAddress: string;
    supermarketName: string;
}

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ''; // Replace with your actual Google Maps API key

const CheckoutModal: React.FC<CheckoutModalProps> = ({
    isOpen,
    onClose,
    cart,
    customerName,
    streetAddress,
    note,
    paymentMethod,
    onNameChange,
    onAddressChange,
    onNoteChange,
    onPaymentMethodChange,
    supermarketAddress,
    supermarketName
}) => {
    const isLoaded = useGoogleMapsLoader(apiKey);
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [distance, setDistance] = useState<number | null>(null);

    const onLoad = useCallback((autoC: google.maps.places.Autocomplete) => {
        setAutocomplete(autoC);
    }, []);

    const handleAddressChange = (address: string) => {
        const event = {
            target: { value: address }
        } as React.ChangeEvent<HTMLInputElement>;
        onAddressChange(event);
    };

    const onPlaceChanged = useCallback(() => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (place.formatted_address) {
                handleAddressChange(place.formatted_address);
                calculateDistance(place.formatted_address);
            }
        }
    }, [autocomplete]);

    const calculateDistance = (address: string) => {
        if (!supermarketAddress || !address) return;

        const service = new google.maps.DistanceMatrixService();

        service.getDistanceMatrix(
            {
                origins: [supermarketAddress],
                destinations: [address],
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (response, status) => {
                if (status === 'OK' && response?.rows[0]?.elements[0]?.distance) {
                    const distanceInMeters = response.rows[0].elements[0].distance.value;
                    const distanceInKilometers = distanceInMeters / 1000;
                    setDistance(distanceInKilometers);
                } else {
                    console.error('Error calculating distance:', status);
                    setDistance(null);
                }
            }
        );
    };

    const cartTotal = cart.reduce((total, item) => {
        const itemPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price;
        return total + itemPrice * item.quantity;
    }, 0);

    const convertToStandardUnit = (weight: number, unit: string): number => {
        switch (unit) {
            case 'g':
                return weight / 1000;
            case 'kg':
                return weight;
            case 'L':
                return weight;
            default:
                return weight;
        }
    };

    const totalWeight = cart.reduce((total, item) => {
        const itemWeightInKgOrLiters = convertToStandardUnit(item.weight, item.unit);
        return total + itemWeightInKgOrLiters * item.quantity;
    }, 0);

    const pickingFee = cart.reduce((total, item) => {
        const itemWeightInKgOrLiters = convertToStandardUnit(item.weight, item.unit);
        return total + item.quantity * 0.25 + itemWeightInKgOrLiters * 0.25;
    }, 0);

    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

    let deliveryRatePerKilometer = 2;
    if (totalQuantity > 100 || totalWeight > 30) {
        deliveryRatePerKilometer = 4;
    }

    const deliveryFee = distance ? distance * deliveryRatePerKilometer : 0;
    const total = (cartTotal + pickingFee + deliveryFee).toFixed(2);

    const handleSendWhatsApp = () => {
        const cartItemsMessage = cart.map(item => {
            const itemPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price;
            return `- ${item.name} (x${item.quantity}): R$${(itemPrice * item.quantity).toFixed(2)}\n  Descrição: ${item.description}`;
        }).join('\n');

        const message = `Detalhes do pedido:\n\nNome: ${customerName}\nEndereço: ${streetAddress}\nObservação: ${note}\nMétodo de Pagamento: ${paymentMethod}\n\nSupermercado: ${supermarketName}\nEndereço do Supermercado: ${supermarketAddress}\n\nItens:\n${cartItemsMessage}\n\nTotal do carrinho: R$${cartTotal.toFixed(2)}\nEscolhendo Taxa: R$${pickingFee.toFixed(2)}\nEntrega Taxa: R$${deliveryFee.toFixed(2)}\nTotal Geral: R$${total}`;
        const phoneNumber = '5551989741442'; // Replace with the actual phone number
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    if (!isOpen) return null;

    if (!isLoaded) {
        return <div>Loading Google Maps...</div>;
    }

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
            <div className='bg-white p-4 rounded w-full max-w-md overflow-y-auto' onScroll={handleScroll}>
                <h2 className='text-xl font-bold mb-4'>Confira</h2>
                <div className='mb-4'>
                    <label className='block mb-2'>Nome</label>
                    <input
                        type='text'
                        value={customerName}
                        onChange={(e) => onNameChange(e)}
                        className='w-full p-2 border rounded'
                    />
                </div>
                <div className='mb-4'>
                    <label className='block mb-2'>Endereço</label>
                    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                        <input
                            type='text'
                            value={streetAddress}
                            onChange={(e) => handleAddressChange(e.target.value)}
                            className='w-full p-2 border rounded'
                        />
                    </Autocomplete>
                </div>
                <div className='mb-4'>
                    <label className='block mb-2'>Observação</label>
                    <textarea
                        value={note}
                        onChange={(e) => onNoteChange(e)}
                        className='w-full p-2 border rounded'
                    ></textarea>
                </div>
                <h2 className='text-xl font-bold mb-4'>Como você vai pagar?</h2>
                <div className='flex mb-4'>
                    <button
                        onClick={() => onPaymentMethodChange('Pix')}
                        className={`flex-1 py-2 rounded text-white ${paymentMethod === 'Pix' ? 'bg-black' : 'bg-gray-600'}`}
                    >
                        Pix
                    </button>
                    <button
                        onClick={() => onPaymentMethodChange('credit-card')}
                        className={`flex-1 py-2 rounded ml-2 text-white ${paymentMethod === 'credit-card' ? 'bg-black' : 'bg-gray-600'}`}
                    >
                        Cartão de crédito
                    </button>
                </div>
                <h2 className="text-2xl font-bold mb-4">Tarifas</h2>
                <p className='text-xl font-semibold'>Supermercado: {supermarketName}</p>
                <p className='text-xl font-semibold'>Total do carrinho: R${cartTotal.toFixed(2)}</p>
                <p className='text-xl font-semibold'>Escolhendo Taxa: R${pickingFee.toFixed(2)}</p>
                <p className='text-xl font-semibold'>Entrega Taxa: R${deliveryFee.toFixed(2)}</p>
                <p className="mt-4 text-xl font-bold">Total Geral: R${total}</p>
                <div className='flex mt-4'>
                    <button
                        onClick={onClose}
                        className='flex-1 py-2 bg-black text-white rounded mr-2'
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSendWhatsApp}
                        className='flex-1 py-2 bg-green-500 text-white rounded'
                    >
                        Enviar WhatsApp
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
