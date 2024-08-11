import React, { Dispatch, SetStateAction, useState, useCallback, useEffect } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { Item } from '@/data/supermarketType';

type CartItem = Item & { quantity: number };

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    cart: CartItem[];
    customerName: string;
    streetAddress: string;
    note: string;
    paymentMethod: 'Pix' | 'credit-card' | null;
    onNameChange: Dispatch<SetStateAction<string>>;
    onAddressChange: Dispatch<SetStateAction<string>>;
    onNoteChange: Dispatch<SetStateAction<string>>;
    onPaymentMethodChange: Dispatch<SetStateAction<'Pix' | 'credit-card' | null>>;
    supermarketAddress: string;
    supermarketName: string; // Add supermarketName prop
}

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
    supermarketName // Destructure supermarketName
}) => {
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [distance, setDistance] = useState<number | null>(null);

    const onLoad = useCallback((autoC: google.maps.places.Autocomplete) => {
        setAutocomplete(autoC);
    }, []);

    const onPlaceChanged = useCallback(() => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (place.formatted_address) {
                onAddressChange(place.formatted_address);
                calculateDistance(place.formatted_address);
            }
        }
    }, [autocomplete, onAddressChange]);

    const calculateDistance = (address: string) => {
        const service = new google.maps.DistanceMatrixService();

        service.getDistanceMatrix(
            {
                origins: [supermarketAddress],
                destinations: [address],
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (response, status) => {
                if (status === 'OK' && response) {
                    const distanceInMeters = response.rows[0].elements[0].distance.value;
                    const distanceInKilometers = distanceInMeters / 1000; // Convert to kilometers

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
                return weight / 1000; // Convert grams to kilograms
            case 'kg':
                return weight; // Already in kilograms
            case 'L':
                return weight; // Assuming 1 liter = 1 kilogram for simplicity
            default:
                return weight; // Default case if the unit is not recognized
        }
    };

    const totalWeight = cart.reduce((total, item) => {
        const itemWeightInKgOrLiters = convertToStandardUnit(item.weight, item.unit);
        return total + itemWeightInKgOrLiters * item.quantity;
    }, 0);

    const pickingFee = cart.reduce((total, item) => {
        const itemWeightInKgOrLiters = convertToStandardUnit(item.weight, item.unit);
        console.log(itemWeightInKgOrLiters)
        return total + item.quantity * 0.25 + itemWeightInKgOrLiters * 0.03;
    }, 0);


    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    

    // Default delivery rate per kilometer
    let deliveryRatePerKilometer = 2;
    if (totalQuantity > 100 || totalWeight > 150) {
        deliveryRatePerKilometer = 4; // Increased rate
    }

    const deliveryFee = distance ? distance * deliveryRatePerKilometer : 0;
    const total = (cartTotal + pickingFee + deliveryFee).toFixed(2);

    const handleSendWhatsApp = () => {
        const cartItemsMessage = cart.map(item => {
            const itemPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price;
            return `- ${item.name} (x${item.quantity}): R$${(itemPrice * item.quantity).toFixed(2)}`;
        }).join('\n');

        const message = `Order Details:\n\nNome: ${customerName}\nEndereço: ${streetAddress}\nObservação: ${note}\nPayment Method: ${paymentMethod}\n\nSupermercado: ${supermarketName}\n\nItems:\n${cartItemsMessage}\n\nTotal do carrinho: R$${cartTotal.toFixed(2)}\nEscolhendo Taxa: R$${pickingFee.toFixed(2)}\nEntrega Taxa: R$${deliveryFee.toFixed(2)}\nTotal Geral: R$${total}`;
        const phoneNumber = '5551989741442'; // Your phone number without the + sign
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = ''; // Reset on cleanup
        };
    }, [isOpen]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        e.stopPropagation(); // Prevent the event from reaching the underlying components
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-1 bg-black bg-opacity-50 flex justify-center items-center text-black z-50'>
            <div className='bg-white p-4 rounded w-full max-w-md overflow-y-auto z-60' onScroll={handleScroll}>
                <h2 className='text-xl font-bold mb-4 text-black'>Confira</h2>
                <div className='mb-4'>
                    <label className='block mb-2 text-black'>Nome</label>
                    <input
                        type='text'
                        value={customerName}
                        onChange={(e) => onNameChange(e.target.value)}
                        className='w-full p-2 border rounded text-black'
                    />
                </div>
                <div className='mb-4 '>
                    <label className='block mb-2 text-black'>Endereço</label>
                    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                        <input
                            type='text'
                            value={streetAddress}
                            onChange={(e) => onAddressChange(e.target.value)}
                            className='w-full p-2 border rounded text-black '
                        />
                    </Autocomplete>
                </div>
                <div className='mb-4'>
                    <label className='block mb-2 text-black'>Observação</label>
                    <textarea
                        value={note}
                        onChange={(e) => onNoteChange(e.target.value)}
                        className='w-full p-2 border rounded text-black'
                    ></textarea>
                </div>
                <h2 className='text-xl font-bold mb-4 text-black'>Como você vai pagar?</h2>
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
                <p className='text-xl font-semibold text-black'>Supermercado: {supermarketName}</p>
                <p className='text-xl font-semibold text-black'>Total do carrinho: R${cartTotal.toFixed(2)}</p>
                <p className='text-xl font-semibold text-black'>Escolhendo Taxa: R${pickingFee.toFixed(2)}</p>
                <p className='text-xl font-semibold text-black'>Entrega Taxa: R${deliveryFee.toFixed(2)}</p>
                <p className="mt-4 text-xl font-bold text-black">Total Geral: R${total}</p>
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
