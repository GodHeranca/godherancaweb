import express from 'express';
import { login, register } from '../controller/authenticationController';

export default (router: express.Router) => {
  // Registration route
  router.post(
    '/auth/register',
    register, // Controller function to handle registration
  );

  // Login route
  router.post('/auth/login', login); // Controller function to handle login
};
