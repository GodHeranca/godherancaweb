import express from 'express';
import {
  getAllUsers,
  updateUser,
  deleteUser,
  getUserOnly,
} from '../controller/usersController';
import { isAuthenticated, isOwner } from '../middlewares';
import { fileUpload, upload } from '../middlewares/upload';

export default (router: express.Router) => {
  router.get('/users', isAuthenticated, getAllUsers);
  router.delete('/users/:id', isAuthenticated, isOwner, deleteUser);
  router.patch(
    '/users/:id',
    isAuthenticated,
    isOwner,
    upload.single('profilePicture'),
    fileUpload,
    updateUser,
  );
  router.get('/users/:id', getUserOnly);
};
