import userService from '../services/userService.js';

const getFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const favorites = await userService.getFavorites(userId);

    return res.status(200).json(favorites);
  } catch (e) {
    next(e);
  }
};

const updateFavorite = async (req, res, next) => {
  try {
    const { action, id, type } = req.body;
    const userId = req.user.id;

    if (!['add', 'remove'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }
    if (id == null || !['movie', 'series'].includes(type)) {
      return res.status(400).json({ message: 'Invalid id or type' });
    }

    const newItem = {
      id: Number(id),
      type,
    };

    if (action === 'add') {
      const favorites = await userService.addFavorite(userId, newItem);
      return res
        .status(201)
        .json({ message: 'Movie added to favorites', favorites });
    }

    const favorites = await userService.deleteFavorite(userId, newItem);
    return res
      .status(200)
      .json({ message: 'Movie removed from favorites', favorites });
  } catch (e) {
    next(e);
  }
};

const getWatchlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const watchList = await userService.getWatchlist(userId);

    return res.status(200).json(watchList);
  } catch (e) {
    next(e);
  }
};

const updateWatchlist = async (req, res, next) => {
  try {
    const { action, id, type } = req.body;
    const userId = req.user.id;

    if (!['add', 'remove'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }
    if (id == null || !['movie', 'series'].includes(type)) {
      return res.status(400).json({ message: 'Invalid id or type' });
    }

    const newItem = {
      id: Number(id),
      type,
    };

    if (action === 'add') {
      const watchList = await userService.addWatchlist(userId, newItem);
      return res
        .status(201)
        .json({ message: 'Movie added to watchlist', watchList });
    }

    const watchList = await userService.deleteWatchlist(userId, newItem);
    return res
      .status(200)
      .json({ message: 'Movie removed from watchlist', watchList });
  } catch (e) {
    next(e);
  }
};

export default {
  getFavorites,
  updateFavorite,
  getWatchlist,
  updateWatchlist,
};
