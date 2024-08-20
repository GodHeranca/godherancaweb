import express from 'express';
import { get, merge } from 'lodash';

import { getUserBySessionToken } from '../controller/userHelper';
import { CustomRequest } from '../types/express';
import Category from '../model/Category';
import Item from '../model/Item';
import { Types } from 'mongoose';
import { IUser } from 'types/userTypes';


export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const sessionToken = req.cookies['GodHeranca-Auth'];
    console.log('Session Token:', sessionToken);

    if (!sessionToken) {
      console.log('No session token found');
      return res.sendStatus(403); // Forbidden if no session token
    }

    const user = (await getUserBySessionToken(sessionToken)) as IUser;
    console.log('Authenticated User:', user);

    if (!user) {
      console.log('User not found');
      return res.sendStatus(403); // Forbidden if user not found
    }

    // Directly set req.user
    (req as CustomRequest).user = user;
    return next();
  } catch (error) {
    console.error('Error in isAuthenticated middleware:', error);
    return res.sendStatus(400); // Bad Request if any error occurs
  }
};


export const isOwner = async (
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const { id } = req.params; // Resource ID from URL parameters
    const currentUserId = req.user?._id?.toString(); // Access user ID

    console.log('Current User ID:', currentUserId);
    console.log('Resource ID:', id);

    if (!currentUserId) {
      console.log('User ID is undefined');
      return res.sendStatus(403); // Forbidden if user ID is undefined
    }

    if (currentUserId !== id) {
      console.log('User ID does not match resource ID');
      return res.sendStatus(403); // Forbidden if user ID does not match resource ID
    }

    return next();
  } catch (error) {
    console.error('Error in isOwner middleware:', error);
    return res.sendStatus(500); // Internal Server Error
  }
};

export const isSupermarketOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const itemId = req.params.id;
    if (!itemId) {
      console.error('Item ID is missing');
      return res.status(400).json({ message: 'Item ID is required' });
    }

    const item = await Item.findById(itemId).populate('supermarket');
    if (!item) {
      console.error('Item not found');
      return res.status(404).json({ message: 'Item not found' });
    }

    let itemSupermarketId: string;

    if (item.supermarket instanceof Types.ObjectId) {
      itemSupermarketId = item.supermarket.toString(); // It's an ObjectId, just convert it to a string
    } else {
      // It's a populated object, so access the _id property
      itemSupermarketId = (item.supermarket as any)._id.toString();
    }

    const userSupermarketId = req.user?.supermarketId?.toString(); // User's supermarket ID

    if (!userSupermarketId) {
      console.error('User supermarket ID is missing');
      return res.status(403).json({
        message:
          'Not authorized to perform this action (Missing User Supermarket ID)',
      });
    }

    if (userSupermarketId !== itemSupermarketId) {
      console.error(
        `Authorization failed. User's supermarket ID: ${userSupermarketId}, Item's supermarket ID: ${itemSupermarketId}`,
      );
      return res
        .status(403)
        .json({
          message: 'Not authorized to perform this action (ID Mismatch)',
        });
    }

    console.log('User authorized, proceeding to next middleware');
    next(); // Proceed to deleteItemsById or any subsequent middleware
  } catch (error) {
    console.error('Error checking supermarket ownership:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



export const isCategoryOwner = async (
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const { id } = req.params; // The ID of the category from the route parameters
    const currentUserId = req.user?._id?.toString(); // The ID of the authenticated user

    console.log('Current User ID:', currentUserId);
    console.log('Category ID:', id);

    if (!currentUserId) {
      console.log('User ID is undefined');
      return res.sendStatus(403); // Forbidden if the user ID is undefined
    }

    // Fetch the category by ID
    const category = await Category.findById(id).exec();
    if (!category) {
      console.log('Category not found');
      return res.sendStatus(404); // Not Found if the category doesn't exist
    }

    console.log('Category userId:', category.userId);

    // Check if the current user owns the category by comparing userId
    if (!category.userId || category.userId.toString() !== currentUserId) {
      console.log('User does not own the category');
      return res.sendStatus(403); // Forbidden if the user doesn't own the category
    }

    return next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error in isCategoryOwner middleware:', error);
    return res.sendStatus(500); // Internal Server Error
  }
};
