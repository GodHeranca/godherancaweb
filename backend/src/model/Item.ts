import mongoose, { Schema, Document, Types } from 'mongoose';

interface IItem extends Document {
  category: Types.ObjectId;
  name: string;
  image: string;
  price: number;
  description: string;
  weight: number;
  stockQuantity: number;
  unit: string;
  discount?: number;
  promotionEnd?: Date;
  supermarket: Types.ObjectId;
  quantityOffers?: IQuantityOffer[]; // Add field for quantity-based offers
}

interface IQuantityOffer {
  quantity: number;
  price: number;
}

const QuantityOfferSchema: Schema<IQuantityOffer> = new Schema({
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const ItemSchema: Schema<IItem> = new Schema({
  category: {
    type: Schema.Types.ObjectId,
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
    type: Schema.Types.ObjectId,
    ref: 'Supermarket',
    required: true,
  },
  quantityOffers: [QuantityOfferSchema], // Use QuantityOfferSchema to define offers
});

const Item = mongoose.model<IItem>('Item', ItemSchema);

export default Item;
