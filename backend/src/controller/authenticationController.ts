import express from 'express';
import { createUser, getUserByEmail } from '../controller/userController';
import { random, authentication } from '../helpers';

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const {
      username,
      email,
      password,
      uid,
      address,
      phone,
      userType,
      profilePicture,
      profile,
    } = req.body;

    if (!username || !email || !password || !uid || !address || !phone || !userType || !profilePicture || !profile) {
        return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.sendStatus(400);
    }

    const salt = random();
    const newUser = await createUser({
      username,
      email,
      uid,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
      address,
      phone,
      userType,
      profilePicture,
      profile,
    });

    return res.status(200).json(newUser).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
