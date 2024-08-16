import express from 'express';
import Category from '../model/Category';

export const createCategory = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id, name } = req.body;
    let imageUrl = '';

    // Handle the image upload if an image file is provided
    if (req.file) {
      imageUrl = req.file.path; // Assuming `path` contains the uploaded image URL
    }

    const newCategory = new Category({
      id,
      name,
      image: imageUrl,
    });

    const savedCategory = await newCategory.save();
    return res.status(201).json(savedCategory);
  } catch (error) {
    console.log(error);
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
    let imageUrl = '';

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Handle the image upload if an image file is provided
    if (req.file) {
      imageUrl = req.file.path; // Assuming `path` contains the uploaded image URL
      category.image = imageUrl;
    }

    category.name = name || category.name;

    const updatedCategory = await category.save();
    return res.status(200).json(updatedCategory);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error updating category', error });
  }
};

export const deleteCategory = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.log(error);
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
    console.log(error);
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
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Error retrieving category', error });
  }
};
