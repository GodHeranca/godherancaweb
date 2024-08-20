import mongoose, { Document, Schema, Types } from 'mongoose';

export type UserType = 'Admin' | 'Driver' | 'Supermarket' | 'Client' | 'Picker';
interface IUser extends Document {
  username: string;
  email: string;
  uid: string;
  authentication: {
    password: string;
    sessionToken?: string;
    salt: string;
  };
  address?: string[];
  phone?: string;
  userType: UserType;
  profilePicture?: string;
  profile: string;
  supermarketId?: Types.ObjectId; // For Supermarket
  driverId?: mongoose.Schema.Types.ObjectId; // For Driver
  clientId?: mongoose.Schema.Types.ObjectId; // For Client
  pickerId?: mongoose.Schema.Types.ObjectId; // For Picker
  adminId?: mongoose.Schema.Types.ObjectId; // For Admin
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
    supermarketId: {
      type: Schema.Types.ObjectId,
      ref: 'Supermarket',
      required: false,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: false,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: false,
    },
    pickerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Picker',
      required: false,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: false,
    },
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
