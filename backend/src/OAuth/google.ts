import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../model/User';
import dotenv from 'dotenv';

dotenv.config();

// Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: `${process.env.NEXT_PUBLIC_API_URL}/oauth/google/callback`, // Adjust this
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create the user
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          const email = profile.emails ? profile.emails[0].value : '';
          const profilePicture = profile.photos ? profile.photos[0].value : '';
          user = new User({
            googleId: profile.id,
            username: profile.displayName || 'No Name',
            email,
            profilePicture,
          });
          await user.save();
        }
        done(null, user);
      } catch (error) {
        done(error, undefined);
      }
    },
  ),
);

// Serialize user info into session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user info from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Export passport
export default passport;
