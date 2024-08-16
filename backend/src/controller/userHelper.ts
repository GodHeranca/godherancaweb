import express from 'express';
import User from '../model/User';
import { IUser } from '../types/userTypes';
import bcrypt from 'bcrypt'



// Update User
export const updateUserById = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

// Delete User
export const deleteUserById = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

// Get Single User
export const getUserById = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

// Get All Users
export const getAllUsers = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

// Get User by Session Token
export const getUserBySessionToken = async (
  sessionToken: string,
): Promise<IUser | null> => {
  return User.findOne({
    'authentication.sessionToken': sessionToken,
  }).exec();
};

// Get User by Email
export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  return User.findOne({ email }).exec();
};

// Verify Account
export const verifyAccount = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    // Logic to verify the account
    res.status(200).json({ message: 'Account verified successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

// Verify Phone
export const verifyPhone = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const user = await User.findOne({ phone: req.body.phone });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    // Logic to verify the phone number
    res.status(200).json({ message: 'Phone verified successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};
