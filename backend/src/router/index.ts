import express from 'express';
import authenticationRoutes from './authentication';
import users from './users';
import supermarket from './supermarket';

const router = express.Router();

export default (): express.Router => {
  authenticationRoutes(router);
  users(router);
  supermarket(router);
  return router;
};
