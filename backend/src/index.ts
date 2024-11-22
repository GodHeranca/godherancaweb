import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './router';

const { OAuth2Client } = require('google-auth-library');

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || ''); 

 // Load environment variables

const app = express();

app.post('/oauth/google-signin', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID || '', // Replace with your client ID
    });

    const payload = ticket.getPayload();
    const userId = payload['sub'];
    const email = payload['email'];
    const name = payload['name'];

    // Here you can handle user registration or login
    // For example, check if the user exists in your database and create a new user if not

    res
      .status(200)
      .json({
        message: 'Google Sign-In successful',
        user: { userId, email, name },
      });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Configure CORS
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true, // Allow credentials if needed
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());
app.use(cookieParser());
// app.use(bodyParser.json());

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  },
);

// Define routes
app.use('/', router());

// Create and start server
const server = http.createServer(app);

server.listen(8080, () => {
  console.log('Server running on http://localhost:8080/');
});


// Connect to MongoDB
mongoose.Promise = Promise;

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error('MongoDB connection string not provided!');
  process.exit(1); // Exit if no connection string is found
}

mongoose
  .connect(mongoUrl!)
  .then(() => console.log('Db connected'))
  .catch((error: Error) => {
    console.error('Error connecting to DB:', error);
    process.exit(1);
  });

// Graceful shutdown on SIGINT
process.on('SIGINT', async () => {
  console.log('SIGINT received. Closing MongoDB connection...');

  try {
    await mongoose.connection.close();
    console.log('MongoDB disconnected on app termination');
  } catch (err) {
    console.error('Error while closing MongoDB connection:', err);
  } finally {
    // Exit the process after closing the connection
    process.exit(0);
  }
});

// Handle connection errors
mongoose.connection.on('error', (error: Error) => console.error(error));