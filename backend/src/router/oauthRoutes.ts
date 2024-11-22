import express from 'express';
import passport from '../OAuth/google'; // Import the configured passport instance

const router = express.Router();

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req: express.Request, res: express.Response) => {
    // On success, redirect user to the desired route
    res.redirect('/inventory');
  },
);

// Other OAuth routes (Facebook, Apple, etc.) can be added here

export default router;
