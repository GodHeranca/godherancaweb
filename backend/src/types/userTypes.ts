import mongoose, { Document } from 'mongoose';
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
  userType: 'Admin' | 'Driver' | 'Supermarket' | 'Client' | 'Picker';
  profilePicture?: string;
  profile: string;
  supermarketId?: mongoose.Schema.Types.ObjectId; // For Supermarket
  driverId?: mongoose.Schema.Types.ObjectId; // For Driver
  clientId?: mongoose.Schema.Types.ObjectId; // For Client
  pickerId?: mongoose.Schema.Types.ObjectId; // For Picker
  adminId?: mongoose.Schema.Types.ObjectId; //
}
