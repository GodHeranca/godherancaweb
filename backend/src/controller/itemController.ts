import express from 'express';
import Item from '../model/Item';
import { upload } from '../middlewares/upload';

// Add a new item
export const addItem = async (req: express.Request, res: express.Response) => {
  try {
    const {
      id,
      categoryId,
      name,
      price,
      description,
      weight,
      stockQuantity,
      unit,
      discount,
      promotionEnd,
    } = req.body;
    let imageUrl = '';

    // Handle the image upload if an image file is provided
    if (req.file) {
      imageUrl = req.file.path; // Assuming `path` contains the uploaded image URL
    }

    const newItem = new Item({
      id,
      categoryId,
      name,
      image: imageUrl,
      price,
      description,
      weight,
      stockQuantity,
      unit,
      discount,
      promotionEnd,
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
    const items = await Item.find({ supermarketId });

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
    const items = await Item.find({ categoryId });

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
    } = req.body;
    let imageUrl = '';

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Handle the image upload if an image file is provided
    if (req.file) {
      imageUrl = req.file.path; // Assuming `path` contains the uploaded image URL
      item.image = imageUrl;
    }

    // Update fields if provided in the request body
    item.name = name || item.name;
    item.price = price || item.price;
    item.description = description || item.description;
    item.weight = weight || item.weight;
    item.stockQuantity = stockQuantity || item.stockQuantity;
    item.unit = unit || item.unit;
    item.discount = discount || item.discount;
    item.promotionEnd = promotionEnd || item.promotionEnd;

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
