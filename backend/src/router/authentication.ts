import express from 'express';
import { register } from '../controller/authenticationController';

export default (router: express.Router) => {
  router.post('/auth/register', register);
};
