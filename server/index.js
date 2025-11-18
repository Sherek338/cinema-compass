import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import authRouter from './router/authRouter.js';
import userRouter from './router/userRouter.js';
import reviewRouter from './router/reviewRouter.js';
import errorMiddleware from './middleware/errorMiddleware.js';

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const PORT = process.env.PORT || 3000;
const URI = process.env.DB_URI;

const clientOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const app = express();

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/reviews', reviewRouter);

app.use(errorMiddleware);

mongoose
  .connect(URI, clientOptions)
  .then(() => {
    console.log('MongoDB connection established');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

if (process.env.MODE === 'dev' || process.env.MODE === 'development') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
