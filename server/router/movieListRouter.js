import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import controller from '../controller/movieListController.js';

const router = express.Router();

router.post('/favorite/:mvId', authMiddleware, controller.addFavorite);
router.delete('/favorite/:mvId', authMiddleware, controller.deleteFavorite);
router.get('/favorite', authMiddleware, controller.getFavorites);

router.post('/watchlist/:mvId', authMiddleware, controller.addWatchlist);
router.delete('/watchlist/:mvId', authMiddleware, controller.deleteWatchlist);
router.get('/watchlist', authMiddleware, controller.getWatchlist);

export default router;