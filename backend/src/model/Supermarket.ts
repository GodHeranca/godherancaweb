import mongoose, { Schema, Document, Types } from 'mongoose';

interface ISupermarket extends Document {
  name: string;
  image?: string;
  address: string;
  categories?: Types.ObjectId[]; // Array of Category ObjectIds
  items?: Types.ObjectId[]; // Array of Item ObjectIds
}

const SupermarketSchema: Schema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: false },
  address: { type: String, required: true },
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
});

const Supermarket = mongoose.model<ISupermarket>(
  'Supermarket',
  SupermarketSchema,
);

export default Supermarket;
