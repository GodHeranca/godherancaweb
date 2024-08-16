import express from 'express';
// import { deleteUserById, getUser, getUserById } from './userHelper';
import cloudinaryStorage from '../helpers/cloudinary';
import localStorage from '../helpers/local';
import User from '../model/User';


// export const getAllUsers = async (
//   req: express.Request,
//   res: express.Response,
// ) => {
//   try {
//     const users = await getUser();

//     return res.status(200).json(users).end();
//   } catch (error) {
//     console.log(error);
//     return res.sendStatus(400);
//   }
// };

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

export const deleteUser = async (
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
// export const deleteUser = async (
//   req: express.Request,
//   res: express.Response,
// ) => {
//   try {
//     const { id } = req.params;

//     const deletedUser = await deleteUserById(id);

//     return res.json(deletedUser);
//   } catch (error) {
//     console.log(error);
//     return res.sendStatus(400);
//   }
// };

export const updateUser = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.file) {
      updates.profilePicture = req.file.path; // Assuming you're using a middleware like Multer to handle file uploads
    }

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};


export const getUserOnly = async (
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

// export const getUserOnly = async (req: express.Request, res: express.Response) => {
//   try {
//     const { id } = req.params;

//     // Retrieve user by id using the helper function
//     const user = await getUserById(id);

//     // If no user is found, return a 404 response
//     if (!user) {
//       return res.sendStatus(404);
//     }

//     // If user is found, return the user object
//     return res.status(200).json(user);
//   } catch (error) {
//     console.error('Error in getUser:', error);
//     return res.sendStatus(400);
//   }
// };
