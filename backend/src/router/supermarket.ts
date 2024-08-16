import express from 'express';
import {
  deleteSupermarket,
  addSupermarket,
  getRandomSupermarkets,
  getSupermarket,
  getAllSupermarkets,
} from '../controller/supermarketController';
import { isAuthenticated, isOwner } from '../middlewares';
import { upload } from '../middlewares/upload';

export default (router: express.Router) => {
  router.get('/supermarket/:id', getSupermarket);
  router.post(
    '/supermarket',
    isAuthenticated,
    isOwner,
    upload.single('image'),
    addSupermarket,
  );
  router.get('/supermarket/random', getRandomSupermarkets);
  router.delete(
    '/supermarkets/:id',
    isAuthenticated,
    isOwner,
    deleteSupermarket,
  );
  router.get('/supermarket', getAllSupermarkets);
};
