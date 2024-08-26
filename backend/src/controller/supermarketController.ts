import express from 'express';
import Supermarket from '../model/Supermarket';

// Add a new supermarket
export const addSupermarket = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    let imageUrl: string | null = null;

    // Handle the image upload if an image file is provided
    if (req.file) {
      if (!req.storage) {
        return res.status(500).json({ message: 'Storage setup is missing' });
      }

      // Use the storage instance to upload the file
      const uploadedImageUrl = await req.storage.uploadFile(req.file);

      // Convert undefined to null
      imageUrl = uploadedImageUrl ?? null;

      // Handle case where uploadFile might return undefined
      if (imageUrl === null) {
        return res.status(500).json({ message: 'Failed to upload file' });
      }
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

// Update a supermarket by ID
export const updateSupermarket = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    let imageUrl: string | null = null;

    // Handle the image upload if a new image file is provided
    if (req.file) {
      if (!req.storage) {
        return res.status(500).json({ message: 'Storage setup is missing' });
      }

      // Use the storage instance to upload the file
      const uploadedImageUrl = await req.storage.uploadFile(req.file);

      // Convert undefined to null
      imageUrl = uploadedImageUrl ?? null;

      // Handle case where uploadFile might return undefined
      if (imageUrl === null) {
        return res.status(500).json({ message: 'Failed to upload file' });
      }
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

// Get a random selection of supermarkets
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

// Delete a supermarket by ID
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

// Get a supermarket by ID
export const getSupermarket = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;

    // Find the supermarket by ID and populate the associated categories and items
    const supermarket = await Supermarket.findById(id)
      .populate({
        path: 'categories',
        populate: {
          path: 'items',
          model: 'Item',
        },
      })
      .exec();

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


// Get all supermarkets
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
