import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  image?: string;
  userId: Types.ObjectId;
  supermarketId: Types.ObjectId;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: false },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  supermarketId: {
    type: Schema.Types.ObjectId,
    ref: 'Supermarket',
    required: true,
  }, // Add this field
});


const Category = mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
