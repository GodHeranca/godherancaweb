import mongoose, { Schema, Document, Types } from 'mongoose';

interface IItem extends Document {
  category: Types.ObjectId; // Correctly use Types.ObjectId
  name: string;
  image: string;
  price: number;
  description: string;
  weight: number;
  stockQuantity: number;
  unit: string;
  discount?: number;
  promotionEnd?: Date;
  supermarket: Types.ObjectId; // Correctly use Types.ObjectId
}

const ItemSchema: Schema<IItem> = new Schema({
  category: {
    type: Schema.Types.ObjectId, // Use Schema.Types.ObjectId for schema definition
    required: true,
    ref: 'Category',
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  weight: { type: Number, required: true },
  stockQuantity: { type: Number, required: true },
  unit: { type: String, required: true },
  discount: { type: Number, default: 0 },
  promotionEnd: { type: Date },
  supermarket: {
    type: Schema.Types.ObjectId, // Use Schema.Types.ObjectId for schema definition
    ref: 'Supermarket',
    required: true,
  },
});

const Item = mongoose.model<IItem>('Item', ItemSchema);

export default Item;
