import mongoose, { Schema, Document } from 'mongoose';

interface IDriver extends Document {
  name: string;
  licenseNumber: string;
  // Other fields
}

const DriverSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    // Other fields
  },
  { timestamps: true },
);

const Driver = mongoose.model<IDriver>('Driver', DriverSchema);
export default Driver;
