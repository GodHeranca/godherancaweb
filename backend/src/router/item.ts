import express from 'express';
import {
  addItem,
  getItemsById,
  getItemsBySupermarket,
  deleteItemsById,
  updateItemsById,
  getItemsByCategory,
} from '../controller/itemController';
import { upload, fileUpload } from '../middlewares/upload';
import {
  isAuthenticated,
  isOwner,
  isSupermarketOwner,
} from '../middlewares';

export default (router: express.Router) => {
  router.post(
    '/item/:id',
    isAuthenticated,
    upload.single('imageUrl'),
    fileUpload,
    addItem,
  );
  router.get('/item/:id', getItemsById);
  router.patch(
    '/item/:id',
    isAuthenticated,
    isSupermarketOwner,
    upload.single('imageUrl'),
    fileUpload,
    updateItemsById,
  );
  router.delete(
    '/item/:id',
    isAuthenticated,
    isSupermarketOwner,
    deleteItemsById,
  );
  router.get('/supermarket/:supermarketId/items', getItemsBySupermarket);
  router.get('/category/:categoryId/items', getItemsByCategory);
};

