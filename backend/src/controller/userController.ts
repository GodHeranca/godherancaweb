import express, { Request, Response } from 'express';
import User from '../model/User';

// Create User
// export const createUser = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { username, email, password, uid, address, phone, userType, profilePicture, profile } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       res.status(400).json({ message: 'User already exists with this email' });
//       return;
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       username,
//       email,
//       uid,
//       authentication: {
//         password: hashedPassword,
//       },
//       address,
//       phone,
//       userType,
//       profilePicture,
//       profile,
//     });

//     const savedUser = await newUser.save();

//     res.status(201).json(savedUser);
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       res.status(500).json({ message: error.message });
//     } else {
//       res.status(500).json({ message: 'An unexpected error occurred' });
//     }
//   }
// };

export const createUser = (values: Record<string, any>) =>
  new User(values).save().then((user) => user.toObject());

// Update User
// export const updateUser = async (
//   req: Request,
//   res: Response,
// ): Promise<void> => {
//   try {
//     const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!user) {
//       res.status(404).json({ message: 'User not found' });
//       return;
//     }
//     res.status(200).json(user);
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       res.status(500).json({ message: error.message });
//     } else {
//       res.status(500).json({ message: 'An unexpected error occurred' });
//     }
//   }
// };
export const updateUserById = (id: string, values: Record<string, any>) =>
  User.findByIdAndUpdate(id, values);

// Delete User
// export const deleteUser = async (
//   req: Request,
//   res: Response,
// ): Promise<void> => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) {
//       res.status(404).json({ message: 'User not found' });
//       return;
//     }
//     res.status(200).json({ message: 'User deleted successfully' });
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       res.status(500).json({ message: error.message });
//     } else {
//       res.status(500).json({ message: 'An unexpected error occurred' });
//     }
//   }
// };
export const deleteUserById = (id: string) =>
  User.findOneAndDelete({ _id: id });

// Get Single User
// export const getUser = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       res.status(404).json({ message: 'User not found' });
//       return;
//     }
//     res.status(200).json(user);
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       res.status(500).json({ message: error.message });
//     } else {
//       res.status(500).json({ message: 'An unexpected error occurred' });
//     }
//   }
// };
export const getUser = () => User.find();

// Get All Users
export const getAllUsers = async (
  req: Request,
  res: Response,
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

export const getUserBySessionToken = (sessionToken: string) =>
  User.findOne({
    'authentication.sessionToken': sessionToken,
  });

export const getUserByEmail = (email: string) => User.findOne({ email });

// Verify Account
export const verifyAccount = async (
  req: Request,
  res: Response,
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
  req: Request,
  res: Response,
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
