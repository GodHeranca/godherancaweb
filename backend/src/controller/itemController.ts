import express from 'express';
import Item from '../model/Item';
import mongoose from 'mongoose';
import User from '../model/User';
import Category from '../model/Category';
import { CustomRequest } from 'types/express';

export const checkSupermarketOwnership = async (
  userId: string,
  supermarketId: string,
): Promise<boolean> => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return false; // User not found
    }
    return user.supermarketId?.toString() === supermarketId;
  } catch (error) {
    console.error('Error in checkSupermarketOwnership:', error);
    return false;
  }
};

// Add a new item
export const addItem = async (req: express.Request, res: express.Response) => {
  try {
    const {
      category,
      name,
      price,
      description,
      weight,
      stockQuantity,
      unit,
      discount,
      promotionEnd,
      supermarket,
      quantityOffers, // New field for quantity-based offers
    } = req.body;

    // Check for required fields
    if (
      !category ||
      !name ||
      !price ||
      !description ||
      !weight ||
      !stockQuantity ||
      !unit ||
      !supermarket
    ) {
      return res
        .status(400)
        .json({ message: 'All required fields must be provided' });
    }

    if (!req.user) {
      return res.status(403).json({ message: 'User is not authenticated' });
    }

    const userId = (req as CustomRequest).user?.id;

    // Verify that the user is the owner of the supermarket
    const isOwner = await checkSupermarketOwnership(userId, supermarket);
    if (!isOwner) {
      return res.status(403).json({
        message:
          'User does not have permission to add items to this supermarket',
      });
    }

    let imageUrl: string = '';

    // Handle file upload
    if (req.file) {
      if (!req.storage) {
        return res.status(500).json({ message: 'Storage setup is missing' });
      }

      const uploadedImageUrl = await req.storage.uploadFile(req.file);

      if (uploadedImageUrl) {
        imageUrl = uploadedImageUrl;
      } else {
        return res.status(500).json({ message: 'Failed to upload file' });
      }
    } else if (req.body.image) {
      imageUrl = req.body.image;
    } else {
      return res.status(400).json({ message: 'Image is required' });
    }

    // Validate and parse quantityOffers if provided
    let parsedQuantityOffers;
    if (quantityOffers) {
      try {
        parsedQuantityOffers = JSON.parse(quantityOffers);
        if (!Array.isArray(parsedQuantityOffers)) {
          throw new Error('quantityOffers must be an array');
        }
        // Further validation can be added here to ensure each offer is valid
      } catch (err) {
        return res.status(400).json({
          message: 'Invalid format for quantityOffers',
        });
      }
    }

    // Create and save new item
    const newItem = new Item({
      category,
      name,
      image: imageUrl,
      price,
      description,
      weight,
      stockQuantity,
      unit,
      discount,
      promotionEnd: promotionEnd ? new Date(promotionEnd) : undefined,
      supermarket,
      quantityOffers: parsedQuantityOffers, // Save quantity-based offers
    });

    const savedItem = await newItem.save();
    return res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error in addItem:', error);
    return res.status(500).json({ message: 'Error adding item', error });
  }
};


// Get item by ID
export const getItemsById = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.status(200).json(item);
  } catch (error) {
    console.error('Error in getItemsById:', error);
    return res.status(500).json({ message: 'Error retrieving item', error });
  }
};

// Get items by supermarket (assuming there's a field related to supermarket)
export const getItemsBySupermarket = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { supermarketId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(supermarketId)) {
      return res.status(400).json({ message: 'Invalid supermarketId format' });
    }

    const items = await Item.find({ supermarket: supermarketId });

    if (!items.length) {
      return res
        .status(404)
        .json({ message: 'No items found for this supermarket' });
    }

    return res.status(200).json(items);
  } catch (error) {
    console.error('Error in getItemsBySupermarket:', error);
    return res.status(500).json({ message: 'Error retrieving items', error });
  }
};

// Get items by category
export const getItemsByCategory = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { categoryId } = req.params;
    const items = await Item.find({ category: categoryId });

    if (!items.length) {
      return res
        .status(404)
        .json({ message: 'No items found for this category' });
    }

    return res.status(200).json(items);
  } catch (error) {
    console.error('Error in getItemsByCategory:', error);
    return res.status(500).json({ message: 'Error retrieving items', error });
  }
};

// Update item by ID
export const updateItemsById = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      description,
      weight,
      stockQuantity,
      unit,
      discount,
      promotionEnd,
      category: categoryId, // Expect category ID
      supermarket,
      quantityOffers, // New field for quantity-based offers
    } = req.body;

    // Check if the category exists by ID
    if (categoryId) {
      const categoryObj = await Category.findById(categoryId);
      if (!categoryObj) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }
    }

    // Find the item to update
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Update fields if provided
    item.name = name || item.name;
    item.price = price || item.price;
    item.description = description || item.description;
    item.weight = weight || item.weight;
    item.stockQuantity = stockQuantity || item.stockQuantity;
    item.unit = unit || item.unit;
    item.discount = discount || item.discount;
    item.promotionEnd = promotionEnd
      ? new Date(promotionEnd)
      : item.promotionEnd;
    item.supermarket = supermarket || item.supermarket;
    item.category = categoryId || item.category;

    // Validate and update quantityOffers if provided
    if (quantityOffers) {
      try {
        const parsedQuantityOffers = JSON.parse(quantityOffers);
        if (!Array.isArray(parsedQuantityOffers)) {
          return res
            .status(400)
            .json({ message: 'quantityOffers must be an array' });
        }
        // Further validation can be added here to ensure each offer is valid
        item.quantityOffers = parsedQuantityOffers;
      } catch (err) {
        return res.status(400).json({
          message: 'Invalid format for quantityOffers',
        });
      }
    }

    // Handle image URL update
    if (req.file) {
      if (!req.storage) {
        return res.status(500).json({ message: 'Storage setup is missing' });
      }
      const uploadedImageUrl = await req.storage.uploadFile(req.file);
      if (uploadedImageUrl) {
        item.image = uploadedImageUrl;
      } else {
        return res.status(500).json({ message: 'Failed to upload file' });
      }
    }

    // Save the updated item
    const updatedItem = await item.save();
    return res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error in updateItemsById:', error);
    return res.status(500).json({ message: 'Error updating item', error });
  }
};



// Delete item by ID
export const deleteItemsById = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    return res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error in deleteItemsById:', error);
    return res.status(500).json({ message: 'Error deleting item', error });
  }
};
