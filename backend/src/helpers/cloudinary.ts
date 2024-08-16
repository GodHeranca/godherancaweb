import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: 'do1hoqtta',
  api_key: '923836884283576',
  api_secret: '0f0rYK5jZCRFJG-cyP8edOhiW_w',
});

const cloudinaryStorage = () => {
  return {
    async uploadFile(file: Express.Multer.File): Promise<string> {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              use_filename: false,
              unique_filename: true,
              overwrite: true,
            },
            (error, result: UploadApiResponse | undefined) => {
              if (error) {
                console.error('Cloudinary upload error:', error);
                return reject(new Error('Failed to upload file to Cloudinary'));
              }
              if (result && result.secure_url) {
                resolve(result.secure_url);
              } else {
                reject(
                  new Error(
                    'Failed to get secure URL from Cloudinary response',
                  ),
                );
              }
            },
          )
          .end(file.buffer); // Upload the file buffer
      });
    },
  };
};

export default cloudinaryStorage;
