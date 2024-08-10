export interface Category {
  id: number;
  name: string;
  image: string;
}

export interface Item {
  id: string; // Changed to string to match UUIDs
  categoryId: number;
  name: string;
  image: string;
  price: number;
  description: string;
  weight: number;
  stockQuantity: number; // Added stockQuantity
  unit: string; // Added unit
  discount?: number; // Discount percentage (e.g., 20 for 20% off)
  promotionEnd?: Date; // End date for the promotion
}

export interface Supermarket {
  name: string;
  image: string;
  address: string;
  categories: Category[];
  items: Item[];
}
