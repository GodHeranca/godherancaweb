import express from 'express';
import { createUser, getUserByEmail } from './userHelper';
import { random, authentication } from '../helpers';
import mongoose from 'mongoose';

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUserByEmail(email).select(
      '+authentication.salt +authentication.password',
    );
    if (!user) {
      return res.sendStatus(400);
    }

    const expectedHash = authentication(user.authentication.salt, password);
    if (user.authentication.password !== expectedHash) {
      return res.sendStatus(403);
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      (user._id as mongoose.Types.ObjectId).toString(),
    );
    await user.save();

    res.cookie('GodHeranca-Auth', user.authentication.sessionToken, {
      domain: 'localhost',
      path: '/',
    });
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

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
