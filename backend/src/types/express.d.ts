// types/express.d.ts

import { File } from 'multer';
import { IUser } from './userTypes'; // Adjust the path as needed
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      file?: File;
      files?: File[];
      storage?: any; // or a more specific type if applicable
      identity?: IUser; // Make sure this matches your user type
    }
  }
}

export interface AuthenticatedRequest extends Request {
  identity: IUser; // Ensure 'identity' is always present
}
