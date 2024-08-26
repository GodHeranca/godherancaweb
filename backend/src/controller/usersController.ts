import express from 'express';
import User from '../model/User';
import Admin from '../model/Admin';
import Client from '../model/Client';
import Driver from '../model/Driver';
import Picker from '../model/Picker';
import Supermarket from '../model/Supermarket';
import Category from '../model/Category';
import Item from '../model/Item';

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

    // Delete associated profiles and related data
    switch (user.userType) {
      case 'Supermarket':
        const supermarket = await Supermarket.findByIdAndDelete(
          user.supermarketId,
        );
        if (supermarket) {
          // Delete associated items and categories for this supermarket
          await Item.deleteMany({ supermarket: supermarket._id });
          await Category.deleteMany({ supermarket: supermarket._id });
        }
        break;

      case 'Driver':
        await Driver.findByIdAndDelete(user.driverId);
        break;

      case 'Client':
        await Client.findByIdAndDelete(user.clientId);
        break;

      case 'Picker':
        await Picker.findByIdAndDelete(user.pickerId);
        break;

      case 'Admin':
        await Admin.findByIdAndDelete(user.adminId);
        break;
    }

    res
      .status(200)
      .json({ message: 'User and all associated data deleted successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};


export const updateUser = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    console.log('Received Update Request:', req.body);
    console.log('Received File:', req.file);

    const { id } = req.params;
    const updates = req.body;

    // Handle profile picture upload
    if (req.file) {
      updates.profilePicture = await req.storage?.uploadFile(req.file);
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Update associated entity based on userType
    switch (user.userType) {
      case 'Supermarket':
        await Supermarket.findByIdAndUpdate(user.supermarketId, {
          name: updatedUser.profile,
          image: updatedUser.profilePicture || '',
          address: updatedUser.address ? updatedUser.address.join(', ') : '',
        });
        break;

      case 'Driver':
        await Driver.findByIdAndUpdate(user.driverId, {
          name: updatedUser.profile,
          licenseNumber: updatedUser.profile,
        });
        break;

      case 'Client':
        await Client.findByIdAndUpdate(user.clientId, {
          name: updatedUser.profile,
        });
        break;

      case 'Picker':
        await Picker.findByIdAndUpdate(user.pickerId, {
          name: updatedUser.profile,
        });
        break;

      case 'Admin':
        await Admin.findByIdAndUpdate(user.adminId, {
          name: updatedUser.profile,
        });
        break;
    }

    res.status(200).json(updatedUser);
  } catch (error: unknown) {
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
