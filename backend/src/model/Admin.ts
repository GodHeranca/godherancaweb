import mongoose, { Schema, Document } from 'mongoose';

interface IAdmin extends Document {
  name: string;
  // Other fields
}

const AdminSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // Other fields
  },
  { timestamps: true },
);

const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);
export default Admin;
