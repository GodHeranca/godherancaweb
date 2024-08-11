import React, { useState } from 'react';
import Image from 'next/image';
import CategoryButton from '@/components/CategoryButton';
import CartItem from '@/components/CartItem';
import ItemCard from '@/components/ItemCard';
import CheckoutModal from '@/components/CheckoutModal';
import ItemModal from '@/components/ItemModal';
import { Item } from '@/data/supermarketType';

type Category = {
    id: number;
    name: string;
    image: string;
};

interface SupermarketPageProps {
    name: string;
    image: string;
    address: string;
    categories: Category[];
    items: Item[];
}

type CartItem = Item & { quantity: number };

const SupermarketPage: React.FC<SupermarketPageProps> = ({ name, image, address, categories, items }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [customerName, setCustomerName] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [note, setNote] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'Pix' | 'credit-card' | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [buttonClicked, setButtonClicked] = useState(false);

    const addToCart = (item: Item) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            } else {
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
    };

    const updateCartItemQuantity = (itemId: number, quantity: number) => {
        setCart((prevCart) =>
            prevCart.map((cartItem) =>
                cartItem.id === itemId
                    ? { ...cartItem, quantity: Math.max(1, quantity) }
                    : cartItem
            )
        );
    };

    const removeFromCart = (itemId: number) => {
        setCart((prevCart) => prevCart.filter((cartItem) => cartItem.id !== itemId));
    };

    const filterItemsByCategoryAndSearch = (): Item[] => {
        let filteredItems = items;
        if (selectedCategory !== null) {
            filteredItems = filteredItems.filter((item) => item.categoryId === selectedCategory);
        }
        if (searchQuery) {
            filteredItems = filteredItems.filter((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return filteredItems;
    };

    const finalizePurchase = () => {
        setButtonClicked(true);
        setIsLoading(true); // Set loading state to true
        setTimeout(() => {
            setButtonClicked(false); // Reset the button state after 200ms
            setIsLoading(false); // Set loading state to false after 1 second
            setIsCheckoutModalOpen(true); // Open the checkout modal
        }, 1000); // Simulate a delay for visual feedback
    };

    const handleOpenItemModal = (item: Item) => {
        setSelectedItem(item);
        setIsItemModalOpen(true);
    };

    const handleCloseItemModal = () => {
        setSelectedItem(null);
        setIsItemModalOpen(false);
    };

    return (
        <div className='flex flex-col lg:flex-row bg-white'>
            <div className='w-full lg:w-3/4 p-4'>
                <Image src={image} alt={name} width={800} height={300} className='rounded-2xl w-full h-auto' />
                <h2 className='text-2xl font-bold mt-4 mb-4'>{name}</h2>
                <p className='text-lg text-gray-600 mb-4'>{address}</p>
                <h2 className='text-2xl font-bold mb-4'>Categorias</h2>
                <div className='flex flex-wrap space-x-4 overflow-x-auto'>
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`flex flex-col items-center px-4 py-2 ${selectedCategory === null ? 'bg-gray-200' : 'bg-white'} text-black rounded mb-4`}
                    >
                        <Image src="/all.svg" alt="All" width={50} height={50} className='rounded py-2' />
                        Todos
                    </button>
                    {categories.map((category) => (
                        <CategoryButton
                            key={category.id}
                            category={category}
                            onClick={() => setSelectedCategory(category.id)}
                            isSelected={selectedCategory === category.id}
                        />
                    ))}
                </div>

                <div className='mt-4 mb-4 text-black'>
                    <input
                        type='text'
                        placeholder='Pesquisar itens...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='w-full p-2 border rounded text-black'
                    />
                </div>

                <div className='grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-5 '> {/* Adjusted gap to reduce space between cards */}
                    {filterItemsByCategoryAndSearch().map((item) => (
                        <ItemCard key={item.id} item={item} onAddToCart={addToCart} onClick={() => handleOpenItemModal(item)} />
                    ))}
                </div>
            </div>

            <div className='w-full lg:w-1/2 md:w-1/2 p-4 bg-white rounded-lg'>
                <h2 className='text-2xl font-bold mb-4'>Carrinho</h2>
                <div>
                    {cart.length === 0 ? (
                        <p className='text-gray-500'>Seu carrinho está vazio.</p>
                    ) : (
                        cart.map((cartItem) => (
                            <CartItem
                                key={cartItem.id}
                                cartItem={cartItem}
                                onQuantityChange={updateCartItemQuantity}
                                onRemove={removeFromCart}
                            />
                        ))
                    )}
                </div>
                <div className='mt-4'>
                    <button
                        onClick={finalizePurchase}
                        className={`w-full py-2 ${buttonClicked ? 'bg-black scale-95' : 'bg-gray-600'} text-white rounded mt-2 flex justify-center items-center transition-transform duration-200`}
                        disabled={cart.length === 0 || isLoading} // Disable the button when loading
                    >
                        {isLoading ? 'Processing...' : 'Finalizar Compra'} {/* Show loading text */}
                    </button>
                </div>
            </div>

            <CheckoutModal
                isOpen={isCheckoutModalOpen}
                onClose={() => setIsCheckoutModalOpen(false)}
                cart={cart}
                customerName={customerName}
                streetAddress={streetAddress}
                note={note}
                paymentMethod={paymentMethod}
                onNameChange={setCustomerName}
                onAddressChange={setStreetAddress}
                onNoteChange={setNote}
                onPaymentMethodChange={setPaymentMethod}
                supermarketAddress={address}
                supermarketName={name}
            />

            <ItemModal
                item={selectedItem}
                isOpen={isItemModalOpen}
                onClose={handleCloseItemModal}
                onAddToCart={addToCart}
            />
        </div>
    );
};

export default SupermarketPage;
