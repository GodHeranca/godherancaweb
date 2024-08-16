import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface LocalStorage {
  uploadFile(file: Express.Multer.File): Promise<string>;
}

export default function localStorage(): LocalStorage {
  return {
    async uploadFile(file: Express.Multer.File): Promise<string> {
      try {
        // Define the upload directory path
        const uploadDir = path.join(__dirname, '..', '..', 'files');
        // Extract the file extension and ensure it's in lowercase
        const fileExtension =
          file.originalname.split('.').pop()?.toLowerCase() || '';
        // Generate a unique filename using UUID
        const newFileName = `${uuidv4()}.${fileExtension}`;
        // Define the complete file path
        const filePath = path.join(uploadDir, newFileName);

        // Ensure the directory exists
        await fs.promises.mkdir(uploadDir, { recursive: true });

        // Write the file to disk
        await fs.promises.writeFile(filePath, file.buffer);

        // Return the file path relative to the public folder
        return `/files/${newFileName}`;
      } catch (error) {
        // Log the error to the console
        console.error('Error uploading file:', error);
        throw new Error('Failed to upload file');
      }
    },
  };
}
