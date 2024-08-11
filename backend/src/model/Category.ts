import mongoose, { Schema, Document } from 'mongoose';

interface ICategory extends Document {
  id: number;
  name: string;
  image: string;
}

const CategorySchema: Schema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
});

const Category = mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
