import mongoose, { Document, Schema, Types } from 'mongoose';

// Define UserType and IUser interface
export type UserType = 'Admin' | 'Driver' | 'Supermarket' | 'Client' | 'Picker';

export interface IUser extends Document {
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
  verificationToken?: string;
  profile: string;
  supermarketId?: mongoose.Types.ObjectId;
  driverId?: mongoose.Types.ObjectId;
  clientId?: mongoose.Types.ObjectId;
  pickerId?: mongoose.Types.ObjectId;
  adminId?: mongoose.Types.ObjectId;
  isVerified: boolean;
  tokenExpiration?: Date;
  [key: string]: any;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /\S+@\S+\.\S+/,
    },
    verificationToken: { type: String },
    isVerified: { type: Boolean, default: false },
    uid: { type: String, required: true, unique: true },
    tokenExpiration: { type: Date },
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
