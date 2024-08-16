import express from 'express';
import {
  addItem,
  getItemsById,
  getItemsBySupermarket,
  deleteItemsById,
  updateItemsById,
  getItemsByCategory,
} from '../controller/itemController';
import { upload } from '../middlewares/upload';
import { isAuthenticated, isOwner } from '../middlewares';

export default (router: express.Router) => { 
    router.post('/item', isAuthenticated, isOwner, upload.single('image'), addItem);
    router.get('/item/:id', getItemsById);
    router.put('/item/:id', isAuthenticated, isOwner, upload.single('image'), updateItemsById);
    router.delete('/item/:id', isAuthenticated, isOwner, deleteItemsById);
    router.get('/supermarket/:supermarketId/items', getItemsBySupermarket);
    router.get('/category/:categoryId/items', getItemsByCategory);
}
