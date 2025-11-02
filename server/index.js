import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import authRouter from './router/authRouter.js';

const PORT = process.env.PORT || 3000;
const uri = process.env.DB_URI;
const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
};

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.use('/api/auth', authRouter);

async function startServer() {
  try {
    await mongoose.connect(uri, clientOptions);
    console.log('Connected to MongoDB');

    if (process.env.MODE === 'dev') {
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

startServer();
