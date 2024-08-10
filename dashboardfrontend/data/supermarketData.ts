import { Supermarket, Item } from './supermarketType';

export const supermarkets: Supermarket[] = [
  {
    name: 'Desco Atacado',
    image: '/Desco_Campo-Bom.jpg',
    address:
      'Av. Senador Alberto Pasqualini, 659-787 - Americano, Lajeado - RS, 95900-000',
    categories: [
      { id: 1, name: 'Bebidas', image: '/beverage.svg' },
      { id: 2, name: 'Lanches', image: '/snack.svg' },
    ],
    items: [
      {
        id: '1',
        categoryId: 1,
        name: 'Coca Cola',
        image: '/coke.png',
        price: 1.99,
        description: 'Refreshing beverage',
        weight: 0.5,
        unit: 'kg',
        discount: 10, // 10% discount
        promotionEnd: new Date('2024-08-15T23:59:59'),
        stockQuantity: 50,
      },
      {
        id: '2',
        categoryId: 1,
        name: 'Pepsi',
        image: '/pepsi.png',
        price: 1.89,
        description: 'Popular cola drink',
        weight: 0.5,
        unit: 'kg',
        discount: 5, // 5% discount
        promotionEnd: new Date('2024-08-10T23:59:59'),
        stockQuantity: 30,
      },
      {
        id: '3',
        categoryId: 2,
        name: 'Lays',
        image: '/lay.jpg',
        price: 2.49,
        description: 'Crispy potato chips',
        weight: 0.2,
        unit: 'kg',
        stockQuantity: 10,
        // No discount or promotion end date
      },
    ],
  },
  {
    name: 'Imec Supermercados',
    image: '/imec.jpg',
    address: 'R. Irmando Weissheimer, 100 - Montanha, Lajeado - RS, 95900-000',
    categories: [
      { id: 3, name: 'Laticínio', image: '/dairy.svg' },
      { id: 4, name: 'Padaria', image: '/bakery.svg' },
    ],
    items: [
      {
        id: '4',
        categoryId: 3,
        name: 'Dalia',
        image: '/milk.jpg',
        price: 0.99,
        description: 'Porção de 200ml (1 copo)',
        weight: 400,
        unit: 'g',
        discount: 15, // 15% discount
        promotionEnd: new Date('2024-08-12T23:59:59'),
        stockQuantity: 0,
      },
      {
        id: '5',
        categoryId: 3,
        name: 'Queijo',
        image: '/cheese.jpg',
        price: 2.99,
        description: 'Cheddar cheese',
        weight: 0.3,
        unit: 'kg',
        discount: 20, // 20% discount
        promotionEnd: new Date('2024-08-20T23:59:59'),
        stockQuantity: 100,
      },
      {
        id: '6',
        categoryId: 4,
        name: 'Seven Boys Pão',
        image: '/bread.jpg',
        price: 1.49,
        description: 'Pão De Forma SEVEN BOYS Pacote 450g',
        weight: 0.45,
        unit: 'kg',
        stockQuantity: 5,
        // No discount or promotion end date
      },
    ],
  },
];

// Export all items from all supermarkets
export const items: Item[] = supermarkets.flatMap(
  (supermarket) => supermarket.items,
);
