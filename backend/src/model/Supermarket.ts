import mongoose, { Schema, Document } from 'mongoose';

interface ISupermarket extends Document {
  name: string;
  image: string;
  address: string;
  categories: number[]; // Array of Category IDs
  items: string[]; // Array of Item IDs
}

const SupermarketSchema: Schema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  categories: [{ type: Number, ref: 'Category' }],
  items: [{ type: String, ref: 'Item' }],
});

const Supermarket = mongoose.model<ISupermarket>(
  'Supermarket',
  SupermarketSchema,
);

export default Supermarket;
