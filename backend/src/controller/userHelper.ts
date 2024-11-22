import express from 'express';
import User from '../model/User';
import bcrypt from 'bcrypt';

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

// Verify Email
export const verifyEmail = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const { email, verificationCode } = req.body;

  console.log("Received email:", email); // Ensure the email is received correctly
    console.log("Received verification code:", verificationCode); 

  // Validate inputs
  if (!email || !verificationCode) {
    res.status(400).json({
      success: false,
      message: 'Email and verification code are required',
    });
    return;
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Check verification token
    const isTokenValid = user.verificationToken
      ? bcrypt.compareSync(verificationCode.toString(), user.verificationToken)
      : false;

    if (!isTokenValid) {
      res
        .status(400)
        .json({ success: false, message: 'Invalid verification code' });
      return;
    }

    // Check token expiration
    const isTokenExpired = (expiration: Date) => new Date() > expiration;

    if (user.tokenExpiration && isTokenExpired(user.tokenExpiration)) {
      res
        .status(400)
        .json({ success: false, message: 'Verification token has expired' });
      return;
    }

    // Update user status
    user.isVerified = true;
    user.verificationToken = undefined;
    user.tokenExpiration = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully. You can now log in.',
    });
  } catch (error) {
    console.error('Error during email verification:', error);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
    });
  }
};