import express from 'express';
import { isAuthenticated, isOwner } from '../middlewares';
import { upload } from '../middlewares/upload';
import {
  getCategory,
  getAllCategory,
  deleteCategory,
  updateCategory,
  createCategory,
} from '../controller/categoryController';

export default (router: express.Router) => {
  router.post(
    '/category',
    isAuthenticated,
    isOwner,
    upload.single('image'),
    createCategory,
  );
  router.put(
    '/category/:id',
    isAuthenticated,
    isOwner,
    upload.single('image'),
    updateCategory,
  );
  router.delete('/category/:id', isAuthenticated, isOwner, deleteCategory);
  router.get('/category/:id', getCategory);
  router.get('/category', getAllCategory);
};
