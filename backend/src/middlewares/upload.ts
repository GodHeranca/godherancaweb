import multer from 'multer';
import logger from '../utils/logger';
import response from '../utils/response';
import localStorage from '../helpers/local';
import cloudinaryStorage from '../helpers/cloudinary';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      storage?: {
        uploadFile: (file: Express.Multer.File) => Promise<string | undefined>;
      };
    }
  }
}

const storage = multer.memoryStorage();

const handleFileSizeLimitException = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return response(res, 413, 'File size limit exceeded.');
  }
  next(error);
};

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: any, acceptFile: boolean) => void,
) => {
  try {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
    if (allowedExtensions.includes(fileExtension as string)) {
      return cb(null, true);
    }
    const error = new Error('Unsupported file type.');
    error.name = 'UnsupportedFileTypeError';
    return cb(error, false);
  } catch (err) {
    logger.error((err as Error).message);
    cb(err, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max file size
  },
});

const fileUpload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    req.storage = isProduction ? await cloudinaryStorage() : localStorage();
    next();
  } catch (error) {
    console.error('Error setting up storage:', error);
    return res.status(500).json({ message: 'File upload setup failed.' });
  }
};

export { fileUpload, upload, handleFileSizeLimitException };
