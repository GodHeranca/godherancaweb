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

    const user = await getUserByEmail(email)
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
    });

    let entityId: mongoose.Schema.Types.ObjectId | undefined;

    switch (userType) {
      case 'Supermarket':
        const newSupermarket = new Supermarket({
          name: profile,
          image: profilePicture || '',
          address: address ? address.join(', ') : '',
          categories: [],
          items: [],
        });
        const savedSupermarket = await newSupermarket.save();
        entityId = savedSupermarket._id as mongoose.Schema.Types.ObjectId; // Type assertion
        newUser.supermarketId = entityId as unknown as Types.ObjectId;
        break;

      case 'Driver':
        const newDriver = new Driver({
          name: profile,
          licenseNumber: profile,
        });
        const savedDriver = await newDriver.save();
        entityId = savedDriver._id as mongoose.Schema.Types.ObjectId; // Type assertion
        newUser.driverId = entityId;
        break;

      case 'Client':
        const newClient = new Client({
          name: profile,
        });
        const savedClient = await newClient.save();
        entityId = savedClient._id as mongoose.Schema.Types.ObjectId; // Type assertion
        newUser.clientId = entityId;
        break;

      case 'Picker':
        const newPicker = new Picker({
          name: profile,
        });
        const savedPicker = await newPicker.save();
        entityId = savedPicker._id as mongoose.Schema.Types.ObjectId; // Type assertion
        newUser.pickerId = entityId;
        break;

      case 'Admin':
        const newAdmin = new Admin({
          name: profile,
        });
        const savedAdmin = await newAdmin.save();
        entityId = savedAdmin._id as mongoose.Schema.Types.ObjectId; // Type assertion
        newUser.adminId = entityId;
        break;
    }

    // Save the user with the correct userType field populated
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

