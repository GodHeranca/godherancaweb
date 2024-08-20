import mongoose, { Schema, Document } from 'mongoose';

interface IClient extends Document {
  name: string;
  // Other fields
}

const ClientSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // Other fields
  },
  { timestamps: true },
);

const Client = mongoose.model<IClient>('Client', ClientSchema);
export default Client;
