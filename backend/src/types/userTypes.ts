// types/userTypes.ts
import mongoose, { Document, Types,  } from 'mongoose';

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
}
