import express from 'express';
import Category from '../model/Category';

export const createCategory = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { name } = req.body;
    let imageUrl: string = '';

    // Ensure userId is available from authenticated user
    const userId = req.user?._id;
    if (!userId) {
      return res.status(403).json({ message: 'User not authenticated' });
    }

    // Handle the image upload if an image file is provided
    if (req.file) {
      if (!req.storage) {
        return res.status(500).json({ message: 'Storage setup is missing' });
      }

      const uploadedImageUrl = await req.storage.uploadFile(req.file);

      // Handle case where uploadFile might return undefined
      if (uploadedImageUrl) {
        imageUrl = uploadedImageUrl;
      } else {
        return res.status(500).json({ message: 'Failed to upload file' });
      }
    }

    const newCategory = new Category({
      name,
      image: imageUrl,
      userId: req.user?._id, // Set userId here
    });

    const savedCategory = await newCategory.save();
    return res.status(201).json(savedCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(500).json({ message: 'Error creating category', error });
  }
};

export const updateCategory = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Ensure user is authenticated
    const userId = req.user?._id;
    if (!userId) {
      return res.status(403).json({ message: 'User not authenticated' });
    }

    // Fetch the category
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Ensure the user owns the category
    if (category.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: 'User does not own the category' });
    }

    // Handle the image upload if an image file is provided
    if (req.file) {
      if (!req.storage) {
        return res.status(500).json({ message: 'Storage setup is missing' });
      }
      try {
        const uploadedImageUrl = await req.storage.uploadFile(req.file);

        if (uploadedImageUrl) {
          category.image = uploadedImageUrl;
        } else {
          return res.status(500).json({ message: 'Failed to upload file' });
        }
      } catch (uploadError) {
        console.error('Error uploading file:', uploadError);
        return res.status(500).json({ message: 'File upload failed' });
      }
    }

    // Update other fields
    category.name = name || category.name;

    const updatedCategory = await category.save();
    return res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    return res.status(500).json({ message: 'Error updating category', error });
  }
};


export const deleteCategory = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;

    // Ensure user is authenticated
    const userId = req.user?._id;
    if (!userId) {
      return res.status(403).json({ message: 'User not authenticated' });
    }

    // Fetch the category
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Ensure the user owns the category
    if (category.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: 'User does not own the category' });
    }

    // Delete the category
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({ message: 'Error deleting category', error });
  }
};

export const getAllCategory = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const categories = await Category.find();
    return res.status(200).json(categories);
  } catch (error) {
    console.error('Error retrieving categories:', error);
    return res
      .status(500)
      .json({ message: 'Error retrieving categories', error });
  }
};

export const getCategory = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.status(200).json(category);
  } catch (error) {
    console.error('Error retrieving category:', error);
    return res
      .status(500)
      .json({ message: 'Error retrieving category', error });
  }
};
