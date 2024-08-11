import express from 'express';

import { deleteUserById, getUser, getUserById } from './userHelper';

export const getAllUsers = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const users = await getUser();

    return res.status(200).json(users).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteUserById(id);

    return res.json(deletedUser);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
      return res.sendStatus(400); // Bad Request if username is not provided
    }

    const user = await getUserById(id);

    if (!user) {
      return res.sendStatus(404); // Not Found if the user does not exist
    }

    user.username = username;
    await user.save();

    return res.status(200).json(user).end(); // Respond with the updated user object
  } catch (error) {
    console.error('Error in updateUser:', error);
    return res.sendStatus(500); // Internal Server Error for unexpected errors
  }
};

