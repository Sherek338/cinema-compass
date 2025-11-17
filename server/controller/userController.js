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
    const userId = req.user.id;
    const newId = {
      id: req.body.id,
      type: req.body.type,
    };

    const favorites = await movieListService.updateFavorite(userId, newId);

    res.status(201).json({ message: 'Movie added to favorites', favorites });
  } catch (e) {
    next(e);
  }
};

const deleteFavorite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const newId = {
      id: req.body.id,
      type: req.body.type,
    };

    const favorites = await movieListService.deleteFavorite(userId, newId);

    res
      .status(200)
      .json({ message: 'Movie removed from favorites', favorites });
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
    const userId = req.user.id;
    const newId = {
      id: req.body.id,
      type: req.body.type,
    };

    const watchList = await movieListService.updateWatchlist(userId, newId);

    res.status(201).json({ message: 'Movie added to watchlist', watchList });
  } catch (e) {
    next(e);
  }
};

const deleteWatchlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const newId = {
      id: req.body.id,
      type: req.body.type,
    };

    const watchList = await movieListService.deleteWatchlist(userId, newId);

    res
      .status(200)
      .json({ message: 'Movie removed from watchlist', watchList });
  } catch (e) {
    next(e);
  }
};

export default {
  getFavorites,
  updateFavorite,
  deleteFavorite,
  getWatchlist,
  updateWatchlist,
  deleteWatchlist,
};
