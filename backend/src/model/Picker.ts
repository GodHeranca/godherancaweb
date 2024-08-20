import mongoose, { Schema, Document } from 'mongoose';

interface IPicker extends Document {
  name: string;
  // Other fields
}

const PickerSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // Other fields
  },
  { timestamps: true },
);

const Picker = mongoose.model<IPicker>('Picker', PickerSchema);
export default Picker;
