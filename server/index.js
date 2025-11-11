import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import authRouter from './router/authRouter.js';
import userRouter from './router/userRouter.js';
import errorMiddleware from './middleware/errorMiddleware.js';

const MODE = process.env.MODE || 'dev';
const PORT = Number(process.env.PORT || 3000);
const MONGO_URI = process.env.DB_URI;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

if (!MONGO_URI) {
  console.error('❌ Missing DB_URI in server/.env');
  process.exit(1);
}

const mongoClientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
};

const corsOptions = {
  origin: CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

const app = express();
app.set('trust proxy', 1);

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', mode: MODE, time: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.use(errorMiddleware);

mongoose
  .connect(MONGO_URI, mongoClientOptions)
  .then(() => {
    console.log('✅ MongoDB connection established');
    if (MODE === 'dev' || MODE === 'development') {
      app.listen(PORT, () => {
        console.log(`🚀 API ready on http://localhost:${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

export default app;
