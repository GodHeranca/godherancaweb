import express from 'express';
import { login, register } from '../controller/authenticationController';

export default (router: express.Router) => {
  router.post('/auth/register', register);
  router.post('/auth/login', login);
};
