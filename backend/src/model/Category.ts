import mongoose, { Schema, Document, Types } from 'mongoose';
import {
  addSubcategoryMiddleware,
  removeSubcategoryMiddleware,
} from '../middlewares/category';

// Define the interface for Category
export interface ICategory extends Document {
  name: string;
  image?: string;
  userId: Types.ObjectId;
  supermarketId: Types.ObjectId;
  parentCategory?: mongoose.Types.ObjectId;
  subcategories: mongoose.Types.ObjectId[];
}

// Define the Category Schema
const CategorySchema: Schema<ICategory> = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: false },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  supermarketId: {
    type: Schema.Types.ObjectId,
    ref: 'Supermarket',
    required: true,
  },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
});


// Apply the middleware functions to the schema
addSubcategoryMiddleware(CategorySchema);
removeSubcategoryMiddleware(CategorySchema);

const Category = mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
