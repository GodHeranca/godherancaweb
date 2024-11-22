import express from 'express';
import { getUserByEmail } from './userHelper'; // Assuming this is the correct import path
import { random, authentication } from '../helpers/index'; // Assuming these utility functions are imported
import User from '../model/User';
import { v4 as uuidv4 } from 'uuid';
import Supermarket from '../model/Supermarket';
import Admin from '../model/Admin';
import Client from '../model/Client';
import Driver from '../model/Driver';
import Picker from '../model/Picker';
import mongoose, { Types } from 'mongoose';
import { sendMail } from '../helpers/email';
import bcrypt from 'bcrypt';

export const login = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await getUserByEmail(email);
    if (!user) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    // Check password
    const isPasswordValid = authentication(password, user.authentication.salt);
    if (!isPasswordValid) {
      res.status(403).json({ message: 'Invalid email or password' });
      return;
    }

    // Generate session token
    const salt = random();
    user.authentication.sessionToken = authentication(salt, user.id.toString());
    await user.save();

    // Set cookie
    res.cookie('GodHeranca-Auth', user.authentication.sessionToken, {
      domain: 'localhost',
      path: '/',
      //  httpOnly: true,
      //  secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      // sameSite: 'lax', // Allow cookies to be sent with cross-site requests
    });

    res.status(200).json(user).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

// Create User
export const register = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const {
      username,
      email,
      password,
      confirmPassword,
      address,
      phone,
      userType,
      profilePicture,
      profile,
    } = req.body;

    // Ensure address is an array
    const addressArray = Array.isArray(address) ? address : [address];

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ message: 'Passwords do not match' });
      return;
    }

    // Hash password
    const salt = random();
    const hashedPassword = authentication(salt, password);

    // Generate and hash a verification token
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const hashedVerificationToken = bcrypt.hashSync(verificationCode, 10);

    const newUser = new User({
      username,
      email,
      uid: uuidv4(),
      authentication: {
        salt,
        password: hashedPassword,
      },
      address: addressArray,
      phone,
      userType,
      profile,
      profilePicture,
      verificationToken: hashedVerificationToken, // Save the hashed token
      tokenExpiration: new Date(Date.now() + 3600 * 1000), // 1-hour expiration
    });

    // Create additional entity based on userType
    let entityId: mongoose.Schema.Types.ObjectId | undefined;

    const createUserEntity = async (
      userType: string,
      profile: string,
      profilePicture: string,
      address: string[],
    ) => {
      switch (userType) {
        case 'Supermarket':
          const newSupermarket = new Supermarket({
            name: profile,
            image: profilePicture || '',
            address: address.join(', ') || '',
          });
          return await newSupermarket.save();

        case 'Driver':
          const newDriver = new Driver({ name: profile });
          return await newDriver.save();

        case 'Client':
          const newClient = new Client({ name: profile });
          return await newClient.save();

        case 'Picker':
          const newPicker = new Picker({ name: profile });
          return await newPicker.save();

        case 'Admin':
          const newAdmin = new Admin({ name: profile });
          return await newAdmin.save();

        default:
          return null;
      }
    };

    const savedEntity = await createUserEntity(
      userType,
      profile,
      profilePicture,
      addressArray,
    );
    
   if (savedEntity) {
     const savedEntityId = savedEntity._id as mongoose.Types.ObjectId; // Assert type
     switch (userType.toLowerCase()) {
       case 'driver':
         newUser.driverId = savedEntityId;
         break;
       case 'client':
         newUser.clientId = savedEntityId;
         break;
       case 'picker':
         newUser.pickerId = savedEntityId;
         break;
       case 'admin':
         newUser.adminId = savedEntityId;
         break;
       case 'supermarket':
         newUser.supermarketId = savedEntityId;
         break;
       default:
         throw new Error(`Unknown userType: ${userType}`);
     }
   }

    // Save the user with the correct userType field populated
    await newUser.save();

    // Send verification email
    try {
      await sendMail({
        email: email,
        subject: 'Email Verification',
        body: `Your verification code is: ${verificationCode}`,
        successMessage: 'Verification email sent successfully.',
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      res.status(201).json({
        message:
          'Registration successful, but we couldn’t send the verification email. Please contact support.',
      });
      return;
    }

    res.status(201).json({
      message:
        'Registration successful. Please check your email to verify your account.',
    });
  } catch (error: unknown) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};


