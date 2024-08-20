import express from 'express';
import { isAuthenticated, isCategoryOwner, isOwner } from '../middlewares';
import { fileUpload, upload } from '../middlewares/upload';
import {
  getCategory,
  getAllCategory,
  deleteCategory,
  updateCategory,
  createCategory,
} from '../controller/categoryController';

export default (router: express.Router) => {
  router.post(
    '/category/:id',
    isAuthenticated, // Only check if the user is authenticated
    upload.single('image'), // Handle the image upload
    fileUpload,
    createCategory, // Handle the category creation
  );
  router.patch(
    '/category/:id',
    isAuthenticated,
    isCategoryOwner,
    upload.single('image'),
    fileUpload,
    updateCategory,
  );
  router.delete('/category/:id', isAuthenticated,isCategoryOwner, deleteCategory);
  router.get('/category/:id', getCategory);
  router.get('/category', getAllCategory);
};
