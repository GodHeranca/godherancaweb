import express from 'express';
import { get, merge } from 'lodash';

import { getUserBySessionToken } from '../controller/userHelper';


export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, 'identity._id') as unknown as string;

    if (currentUserId.toString() !== id) {
      return res.sendStatus(403); // Forbidden if user ID does not match resource ID
    }

    next();
  } catch (error) {
    console.error('Error in isOwner middleware:', error);
    return res.sendStatus(400); // Bad Request in case of any error
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
      return res.sendStatus(403);
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
