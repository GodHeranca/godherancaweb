import express from 'express';
import User from '../model/User';

// Get User by Session Token
export const getUserBySessionToken = async (sessionToken: string) => {
  try {
    const user = await User.findOne({
      'authentication.sessionToken': sessionToken,
    }).exec();
    console.log('User found by session token:', user);
    return user;
  } catch (error) {
    console.error('Error finding user by session token:', error);
    throw error;
  }
};


// Get User by Email
export const getUserByEmail = (email: string) => User.findOne({email})
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
