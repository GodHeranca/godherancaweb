import express from 'express';
import Supermarket from '../model/Supermarket';
import cloudinaryStorage from '../helpers/cloudinary';
import localStorage from '../helpers/local';

export const addSupermarket = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    // Determine if you're in a production environment
    const isProduction = process.env.NODE_ENV === 'production';
    let imageUrl: string | null = null;

    // Handle the image upload if an image file is provided
    if (req.file) {
      const storageInstance = isProduction
        ? await cloudinaryStorage() // Use Cloudinary in production
        : await localStorage(); // Use local storage in development

      imageUrl = await storageInstance.uploadFile(req.file);
    }

    // Create a new supermarket document, including the image URL if available
    const newSupermarket = new Supermarket({
      ...req.body,
      image: imageUrl || req.body.image, // Use the uploaded image URL or a default
    });

    // Save the supermarket document to the database
    const savedSupermarket = await newSupermarket.save();

    // Respond with the saved supermarket data
    return res.status(201).json(savedSupermarket);
  } catch (error) {
    // Handle errors and respond with a 500 status
    return res.status(500).json({ message: 'Error adding supermarket', error });
  }
};

export const getRandomSupermarkets = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const count = await Supermarket.countDocuments();
    const random = Math.floor(Math.random() * count);
    const supermarkets = await Supermarket.find().skip(random).limit(5);
    return res.status(200).json(supermarkets);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error fetching supermarkets', error });
  }
};

export const deleteSupermarket = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const deletedSupermarket = await Supermarket.findByIdAndDelete(id);
    if (!deletedSupermarket) {
      return res.status(404).json({ message: 'Supermarket not found' });
    }
    return res
      .status(200)
      .json({ message: 'Supermarket deleted successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error deleting supermarket', error });
  }
};

export const getSupermarket = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const supermarket = await Supermarket.findById(id);
    // .populate('categories')
    // .populate('items');
    if (!supermarket) {
      return res.status(404).json({ message: 'Supermarket not found' });
    }
    return res.status(200).json(supermarket);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error fetching supermarket', error });
  }
};

export const getAllSupermarkets = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const supermarkets = await Supermarket.find();
    return res.status(200).json(supermarkets);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error fetching supermarkets', error });
  }
};

export const updateSupermarket = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params; // Get the supermarket ID from the request parameters
    const isProduction = process.env.NODE_ENV === 'production';
    let imageUrl: string | null = null;

    // Handle the image upload if a new image file is provided
    if (req.file) {
      const storageInstance = isProduction
        ? await cloudinaryStorage() // Use Cloudinary in production
        : await localStorage(); // Use local storage in development

      imageUrl = await storageInstance.uploadFile(req.file);
    }

    // Find the supermarket by ID and update it with the new data
    const updatedSupermarket = await Supermarket.findByIdAndUpdate(
      id,
      {
        ...req.body,
        image: imageUrl || req.body.image, // Use the uploaded image URL or keep the existing one
      },
      { new: true }, // Return the updated document
    );

    if (!updatedSupermarket) {
      return res.status(404).json({ message: 'Supermarket not found' });
    }

    // Respond with the updated supermarket data
    return res.status(200).json(updatedSupermarket);
  } catch (error) {
    // Handle errors and respond with a 500 status
    return res
      .status(500)
      .json({ message: 'Error updating supermarket', error });
  }
};
