import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import authRouter from './router/authRouter.js';
import movieListRouter from './router/userRouter.js';
import reviewRouter from './router/reviewRouter.js';
import authRouter from './router/adminRouter.js';
import errorMiddleware from './middleware/errorMiddleware.js';

const PORT = process.env.PORT || 3000;
const URI = process.env.DB_URI;
const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
};
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use('/api/auth', authRouter);
app.use('/api/user', movieListRouter);
app.use('/api/review', reviewRouter);
app.use('/api/admin', authRouter);

app.use(errorMiddleware);

mongoose
  .connect(URI, clientOptions)
  .then(() => {
    console.log('MongoDB connection established');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

if (process.env.MODE === 'development') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
