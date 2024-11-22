import express from 'express';
import authenticationRoutes from './authentication';
import users from './users';
import supermarket from './supermarket';
import category from './category';
import item from './item';
import oauthRoutes from './oauthRoutes'; // Import OAuth routes
import verification from './verification'; // Import email verification routes

const router = express.Router();

// Set up routes
authenticationRoutes(router);
users(router);
supermarket(router);
category(router);
item(router);
router.use('/oauth', oauthRoutes); // Mount OAuth routes
router.use('/verify', verification); // Mount verification routes

export default (): express.Router => {
  return router;
};
