import movieListService from '../services/userService.js';

const getFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const favorites = await movieListService.getFavorites(userId);

    res.status(200).json(favorites);
  } catch (e) {
    next(e);
  }
};

const updateFavorite = async (req, res, next) => {
  try {
    const action = req.body.action;
    const userId = req.user.id;
    const newId = {
      id: req.body.id,
      type: req.body.type,
    };

    if (action === 'add') {
      const favorites = await movieListService.updateFavorite(userId, newId);
      return res
        .status(201)
        .json({ message: 'Movie added to favorites', favorites });
    } else if (action === 'remove') {
      const favorites = await movieListService.deleteFavorite(userId, newId);
      return res
        .status(200)
        .json({ message: 'Movie removed from favorites', favorites });
    }
    res.status(400);
  } catch (e) {
    next(e);
  }
};

const getWatchlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const watchList = await movieListService.getWatchlist(userId);

    res.status(200).json(watchList);
  } catch (e) {
    next(e);
  }
};

const updateWatchlist = async (req, res, next) => {
  try {
    const action = req.body.action;
    const userId = req.user.id;
    const newId = {
      id: req.body.id,
      type: req.body.type,
    };

    if (action === 'add') {
      const watchList = await movieListService.addWatchlist(userId, newId);
      return res
        .status(201)
        .json({ message: 'Movie added to watchlist', watchList });
    } else if (action === 'remove') {
      const watchList = await movieListService.deleteWatchlist(userId, newId);
      return res
        .status(200)
        .json({ message: 'Movie removed from watchlist', watchList });
    }
    res.status(400);
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
