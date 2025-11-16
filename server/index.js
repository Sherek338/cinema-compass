import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

import authRouter from "./router/authRouter.js";
import movieListRouter from "./router/movieListRouter.js";
import reviewRouter from "./router/reviewRouter.js";
import userRouter from "./router/userRouter.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();

const PORT = process.env.PORT || 3000;
const URI = process.env.DB_URI;

const clientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
};

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/movies", movieListRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/user", userRouter);

app.use(errorMiddleware);

mongoose
  .connect(URI, clientOptions)
  .then(() => {
    console.log("MongoDB connection established");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

if (process.env.MODE === "dev") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
