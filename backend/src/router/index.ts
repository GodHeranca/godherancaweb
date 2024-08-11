import express from 'express';
import authenticationRoutes from './authentication';
import users from './users';

const router = express.Router();

export default (): express.Router => {
  authenticationRoutes(router);
  users(router);
  return router;
};
