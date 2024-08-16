// types.d.ts
import { Multer } from 'multer';

declare global {
  namespace Express {
    interface Request {
      storage?: {
        uploadFile: (file: Express.Multer.File) => Promise<string | undefined>;
      };
    }
  }
}
