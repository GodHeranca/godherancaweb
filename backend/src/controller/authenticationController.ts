import express from 'express';
import { getUserByEmail } from './userHelper'; // Assuming this is the correct import path
import bcrypt from 'bcrypt'; // Assuming bcrypt is used for password hashing
import { random, authentication } from '../helpers/index'; // Assuming these utility functions are imported
import User from '../model/User';
import { v4 as uuidv4 } from 'uuid';

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
    const isPasswordValid = await bcrypt.compare(
      password,
      user.authentication.password,
    );
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
      // httpOnly: true, // Makes the cookie inaccessible to JavaScript on the client side
      // secure: true, // Ensures the cookie is sent only over HTTPS
      // sameSite: 'strict', // Helps prevent CSRF attacks
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
      address,
      phone,
      userType,
      profilePicture,
      profile,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    const confirmPassword = password;

    if (password !== confirmPassword) {
      res.sendStatus(404).json({ message: 'Incorrect password' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const uid = uuidv4();

    const newUser = new User({
      username,
      email,
      uid,
      authentication: {
        password: hashedPassword,
      },
      address,
      phone,
      userType,
      profilePicture,
      profile,
    });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};
