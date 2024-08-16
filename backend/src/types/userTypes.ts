import { Document } from 'mongoose';
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
}
