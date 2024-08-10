import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './router'

dotenv.config(); // Load environment variables

const app = express();

app.use(
  cors({
    credentials: true,
  }),
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
  console.log('Server running on http://localhost:8080/');
});

mongoose.Promise = Promise;

const mongoUrl = process.env.MONGO_URL;

mongoose
  .connect(mongoUrl!)
  .then(() => console.log('Db connected'))
  .catch((error: Error) => console.log('Error connecting to DB:', error));

mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/', router());
