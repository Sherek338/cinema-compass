import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getUserLists,
  updateWatchlist,
  updateFavorites,
} from "../controller/userController.js";

const router = express.Router();

router.get("/lists", authMiddleware, getUserLists);

router.put("/watchlist", authMiddleware, updateWatchlist);

router.put("/favorites", authMiddleware, updateFavorites);

export default router;
