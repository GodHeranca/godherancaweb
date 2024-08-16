import express from 'express';
import { get, merge } from 'lodash';

import {  getUserBySessionToken } from '../controller/userHelper';

import User from '../model/User';

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, 'identity._id') as string | undefined;

    console.log(currentUserId);

    if (!currentUserId) {
      return res.sendStatus(403); // Forbidden if user ID or session token is undefined
    }

    const currentUser = await User.findById(id).exec();

    if (!currentUser) {
      return res.sendStatus(404); // Not Found if user does not exist
    }

    if (currentUser.userType === 'Admin') {
      // Allow the admin to bypass the ownership check
      return next();
    }

    if (currentUserId.toString() !== id) {
      return res.sendStatus(403); // Forbidden if user ID does not match resource ID
    }

    next();
  } catch (error) {
    console.error('Error in isOwner middleware:', error);
    return res.sendStatus(500); // Internal Server Error in case of any error
  }
};


export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const sessionToken = req.cookies['GodHeranca-Auth'];

    if (!sessionToken) {
      return res.sendStatus(403); // Forbidden if no session token
    }

    const user = await getUserBySessionToken(sessionToken);

    console.log(user);

    if (!user) {
      return res.sendStatus(403); // Forbidden if user not found
    }

    merge(req, { identity: user });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400); // Bad Request if any error occurs
  }
};
