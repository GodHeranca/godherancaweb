import express from 'express';
import Category from '../model/Category';
import mongoose, { Types } from 'mongoose';

export const createCategory = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { name, supermarketId, parentCategory } = req.body;
    let imageUrl: string = '';

    // Ensure userId is available from authenticated user
    const userId = req.user?._id;
    if (!userId) {
      return res.status(403).json({ message: 'User not authenticated' });
    }

    if (!supermarketId) {
      return res.status(400).json({ message: 'Supermarket ID is required' });
    }

    // Handle the image upload if an image file is provided
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
    }

    // Convert parentCategoryId to ObjectId if it's provided
    const parentCategoryObjectId = parentCategory
      ? mongoose.Types.ObjectId.isValid(parentCategory)
        ? new mongoose.Types.ObjectId(parentCategory)
        : undefined
      : undefined;

    // Create a new category with optional parent category
    const newCategory = new Category({
      name,
      image: imageUrl,
      userId,
      supermarketId,
      parentCategory: parentCategoryObjectId,
    });

    const savedCategory = await newCategory.save();

    // Update the parent category if needed
    if (parentCategoryObjectId) {
      await Category.findByIdAndUpdate(parentCategoryObjectId, {
        $addToSet: { subcategories: savedCategory._id },
      });
    }

    // Populate the parentCategory and subcategories fields
    const populatedCategory = await Category.findById(savedCategory._id)
      .populate('parentCategory')
      .populate('subcategories')
      .exec();

    return res.status(201).json(populatedCategory);
  } catch (error) {
    console.error('Error creating category:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      errorDetails: error,
    });
    return res.status(500).json({ message: 'Error creating category', error });
  }
};

export const updateCategory = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const { name, parentCategory } = req.body;

    // Ensure user is authenticated
    const userId = req.user?._id;
    if (!userId) {
      return res.status(403).json({ message: 'User not authenticated' });
    }

    // Fetch the category
    let category = await Category.findById(id);
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

    // Convert parentCategoryId to ObjectId if it's provided
    const newParentCategoryObjectId = parentCategory
      ? mongoose.Types.ObjectId.isValid(parentCategory)
        ? new mongoose.Types.ObjectId(parentCategory)
        : undefined
      : undefined;

    // Update parent category if necessary
    if (
      newParentCategoryObjectId &&
      newParentCategoryObjectId.toString() !==
        category.parentCategory?.toString()
    ) {
      // Remove from old parent's subcategories array
      if (category.parentCategory) {
        await Category.findByIdAndUpdate(category.parentCategory, {
          $pull: { subcategories: category._id },
        });
      }

      // Add to new parent's subcategories array
      await Category.findByIdAndUpdate(newParentCategoryObjectId, {
        $addToSet: { subcategories: category._id },
      });

      category.parentCategory = newParentCategoryObjectId;
    } else if (!newParentCategoryObjectId) {
      // If newParentCategoryObjectId is undefined, ensure to remove category from its current parent
      if (category.parentCategory) {
        await Category.findByIdAndUpdate(category.parentCategory, {
          $pull: { subcategories: category._id },
        });
      }

      category.parentCategory = undefined;
    }

    // Update other fields
    category.name = name || category.name;

    const updatedCategory = await category.save();

    // Populate the parentCategory and subcategories fields
    const populatedCategory = await Category.findById(updatedCategory._id)
      .populate('parentCategory')
      .populate('subcategories')
      .exec();

    return res.status(200).json(populatedCategory);
  } catch (error) {
    console.error('Error updating category:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      errorDetails: error,
    });
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

    // Remove from parent's subcategories array if it has a parent
    if (category.parentCategory) {
      await Category.findByIdAndUpdate(category.parentCategory, {
        $pull: { subcategories: category._id },
      });
    }

    // Optionally handle subcategories (e.g., delete them or reassign them)
    // Here, we'll just delete the subcategories for simplicity
    await Category.deleteMany({ parentCategory: category._id });

    // Delete the category
    await Category.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ message: 'Category and its subcategories deleted successfully' });
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

    // Fetch the category with its parent category and subcategories
    const category = await Category.findById(id)
      .populate('parentCategory') // Populate parent category
      .populate('subcategories')
      .exec(); // Populate subcategories

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

export const getCategoryBySupermarket = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { supermarketId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(supermarketId)) {
      return res.status(400).json({ message: 'Invalid supermarketId format' });
    }

    // Find categories by supermarketId and populate the parent category and subcategories
    const categories = await Category.find({ supermarketId })
      .populate('parentCategory')
      .populate('subcategories')
      .exec();

    return res.status(200).json(categories); // Always return a 200 with the array, even if empty
  } catch (error) {
    console.error('Error in getCategoryBySupermarket:', error);
    return res
      .status(500)
      .json({ message: 'Error retrieving categories', error });
  }
};




