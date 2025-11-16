import movieListService from '../services/movieListService.js';

const getFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const favorites = await movieListService.getFavorites(userId);

    res.status(200).json(favorites);
  } catch (e) {
    next(e);
  }
};

const addFavorite = async (req, res, next) => {
  try {
    const movieId = req.params.mvId;
    const userId = req.user.id;

    const favorites = await movieListService.addFavorite(userId, movieId);

    res.status(201).json({ message: 'Movie added to favorites', favorites });
  } catch (e) {
    next(e);
  }
};

const deleteFavorite = async (req, res, next) => {
  try {
    const movieId = req.params.mvId;
    const userId = req.user.id;

    const favorites = await movieListService.deleteFavorite(userId, movieId);

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

const addWatchlist = async (req, res, next) => {
  try {
    const movieId = req.params.mvId;
    const userId = req.user.id;

    const watchList = await movieListService.addWatchlist(userId, movieId);

    res.status(201).json({ message: 'Movie added to watchlist', watchList });
  } catch (e) {
    next(e);
  }
};

const deleteWatchlist = async (req, res, next) => {
  try {
    const movieId = req.params.mvId;
    const userId = req.user.id;

    const watchList = await movieListService.deleteWatchlist(userId, movieId);

    res
      .status(200)
      .json({ message: 'Movie removed from watchlist', watchList });
  } catch (e) {
    next(e);
  }
};

export default {
  getFavorites,
  addFavorite,
  deleteFavorite,
  getWatchlist,
  addWatchlist,
  deleteWatchlist,
};