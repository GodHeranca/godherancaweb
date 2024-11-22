import express from 'express';
import { verifyEmail } from '../controller/userHelper';

const router = express.Router(); // Initialize the router properly

// Define your routes
router.post('/', verifyEmail);

export default router; // Export the router instance
