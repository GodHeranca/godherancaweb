import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './router';


dotenv.config(); // Load environment variables

const app = express();

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
app.use(bodyParser.json());

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

mongoose
  .connect(mongoUrl!)
  .then(() => console.log('Db connected'))
  .catch((error: Error) => console.log('Error connecting to DB:', error));

mongoose.connection.on('error', (error: Error) => console.log(error));
