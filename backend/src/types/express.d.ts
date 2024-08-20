// types/express.d.ts
import { File } from 'multer';
import { IUser } from './userTypes'; // Adjust the path to where IUser is defined
import express from 'express'

declare global {
  namespace Express {
    interface Request {
      file?: File;
      files?: File[];
      identity?: IUser; // Ensure this matches your actual user type
      user?: IUser; // Make sure this is included
    }
  }
}

// Optional: Define a more specific request type for authenticated users
export interface CustomRequest extends express.Request {
  user?: IUser; // Custom user property
  supermarketId?: string;
}
