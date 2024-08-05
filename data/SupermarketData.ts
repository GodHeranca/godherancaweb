export interface Category {
  id: number;
  name: string;
  image: string;
}

export interface Item {
  id: number;
  categoryId: number;
  name: string;
  image: string;
  price: number;
  description: string;
}

export interface Supermarket {
  name: string;
  image: string;
  address: string;
  categories: Category[];
  items: Item[];
}

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
        id: 1,
        categoryId: 1,
        name: 'Coca Cola',
        image: '/coke.png',
        price: 1.99,
        description: 'Refreshing beverage',
      },
      {
        id: 2,
        categoryId: 1,
        name: 'Pepsi',
        image: '/pepsi.png',
        price: 1.89,
        description: 'Popular cola drink',
      },
      {
        id: 3,
        categoryId: 2,
        name: 'Lays',
        image: '/lay.jpg',
        price: 2.49,
        description: 'Crispy potato chips',
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
        id: 4,
        categoryId: 3,
        name: 'Dalia',
        image: '/milk.jpg',
        price: 0.99,
        description: 'Porção de 200ml (1 copo)',
      },
      {
        id: 5,
        categoryId: 3,
        name: 'Queijo',
        image: '/cheese.jpg',
        price: 2.99,
        description: 'Cheddar cheese',
      },
      {
        id: 6,
        categoryId: 4,
        name: 'Seven Boys Pão',
        image: '/bread.jpg',
        price: 1.49,
        description: 'Pão De Forma SEVEN BOYS Pacote 450g',
      },
    ],
  },
];
