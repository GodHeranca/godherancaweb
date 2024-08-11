import express from 'express';
import Supermarket from '../model/Supermarket';

export const addSupermarket = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const newSupermarket = new Supermarket(req.body);
    const savedSupermarket = await newSupermarket.save();
    return res.status(201).json(savedSupermarket);
  } catch (error) {
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
    const supermarket = await Supermarket.findById(id)
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
