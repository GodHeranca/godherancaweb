import mongoose, { Schema, Document } from 'mongoose';

interface IItem extends Document {
  id: string; // UUID
  categoryId: number;
  name: string;
  image: string;
  price: number;
  description: string;
  weight: number;
  stockQuantity: number;
  unit: string;
  discount?: number;
  promotionEnd?: Date;
}

const ItemSchema: Schema = new Schema({
  id: { type: String, required: true }, // UUID
  categoryId: { type: Number, required: true, ref: 'Category' },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  weight: { type: Number, required: true },
  stockQuantity: { type: Number, required: true },
  unit: { type: String },
  discount: { type: Number, required: false }, // Not required
  promotionEnd: { type: Date, required: false }, // Not required
});

const Item = mongoose.model<IItem>('Item', ItemSchema);

export default Item;
