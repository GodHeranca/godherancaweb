import express from 'express';
import {
  deleteSupermarket,
  addSupermarket,
  getRandomSupermarkets,
  getSupermarket,
} from '../controller/supermarketController';
import { isAuthenticated, isOwner } from '../middlewares';

export default (router: express.Router) => {
    router.get('/supermarket/:id', getSupermarket);
    router.post('/supermarket', addSupermarket)
};
