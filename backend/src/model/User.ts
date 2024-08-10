import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  uid: string;
  authentication: {
    password: string;
    sessionToken?: string;
  };
  address?: string[];
  phone?: string;
  userType: 'Admin' | 'Driver' | 'Supermarket' | 'Client' | 'Picker';
  profilePicture?: string;
  profile: string;
}

const UserSchema: Schema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /\S+@\S+\.\S+/,
    },
    uid: { type: String, required: true, unique: true },
    authentication: {
      password: { type: String, required: true, minlength: 6 },
      sessionToken: { type: String, select: false },
      salt: { type: String, select: false },
    },
    address: { type: [String], required: false },
    phone: { type: String, required: false },
    userType: {
      type: String,
      required: true,
      enum: ['Admin', 'Driver', 'Supermarket', 'Client', 'Picker'],
    },
    profilePicture: { type: String, required: false },
    profile: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>('User', UserSchema);
