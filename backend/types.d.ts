// types/express.d.ts

// import  {File}  from 'multer';
import { IUser } from './src/types/userTypes'; // Adjust the path as needed

// declare global {
//   namespace Express {
//     interface Request {
//       file?: File;
//       files?: File[];
//       storage?: any; // or a more specific type if applicable
//       identity?: IUser; // Make sure this matches your user type
//       user?: IUser; // Ensure this matches the user type you expect
//     }
//   }
// }

// Optional: Define a more specific request type for authenticated users
export interface AuthenticatedRequest extends Request {
  user: IUser; // Ensure 'user' is always present for authenticated requests
}
