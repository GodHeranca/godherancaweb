import express from 'express';
import authenticationRoutes from './authentication';
import users from './users';
import supermarket from './supermarket';
import category from './category';
import item from './item';

const router = express.Router();

export default (): express.Router => {
  authenticationRoutes(router);
  users(router);
  supermarket(router);
  category(router);
  item(router);
  return router;
};
