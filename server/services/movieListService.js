import ApiError from '../exceptions/ApiError.js';
import UserModel from '../models/UserModel.js';

const getFavorites = async (userId) => {
  if (!userId) {
    throw ApiError.BadRequest('User id is required');
  }

  const favoriteList = await UserModel.findById(userId).select('favoriteList');

  return favoriteList;
};

const addFavorite = async (userId, movieId) => {
  if (!userId || !movieId) {
    throw ApiError.BadRequest('User id and Movie id are required');
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw ApiError.NotFound('User not found');
  }

  const indexOfMovie = user.favoriteList.indexOf(movieId);
  if (indexOfMovie !== -1) {
    throw ApiError.Conflict('Movie already in favorites');
  }

  user.favoriteList.push(movieId);
  await user.save();
  return user.favoriteList;
};

const deleteFavorite = async (userId, movieId) => {
  if (!userId || !movieId) {
    throw ApiError.BadRequest('User id and Movie id are required');
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw ApiError.NotFound('User not found');
  }

  const indexOfMovie = user.favoriteList.indexOf(movieId);
  if (indexOfMovie === -1) {
    throw ApiError.NotFound('Movie not found in favorites');
  }

  user.favoriteList = user.favoriteList.filter(
    (_, index) => index !== indexOfMovie
  );
  await user.save();
  return user.favoriteList;
};

const getWatchlist = async (userId) => {
  if (!userId) {
    throw ApiError.BadRequest('User id is required');
  }

  const watchList = await UserModel.findById(userId).select('watchList');

  return watchList;
};

const addWatchlist = async (userId, movieId) => {
  if (!userId || !movieId) {
    throw ApiError.BadRequest('User id and Movie id are required');
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw ApiError.NotFound('User not found');
  }

  const indexOfMovie = user.watchList.indexOf(movieId);
  if (indexOfMovie !== -1) {
    throw ApiError.Conflict('Movie already in watchlist');
  }

  user.watchList.push(movieId);
  await user.save();
  return user.watchList;
};

const deleteWatchlist = async (userId, movieId) => {
  if (!userId || !movieId) {
    throw ApiError.BadRequest('User id and Movie id are required');
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw ApiError.NotFound('User not found');
  }

  const indexOfMovie = user.watchList.indexOf(movieId);
  if (indexOfMovie === -1) {
    throw ApiError.NotFound('Movie not found in watchlist');
  }

  user.watchList = user.watchList.filter((_, index) => index !== indexOfMovie);
  await user.save();
  return user.watchList;
};

export default {
  getFavorites,
  addFavorite,
  deleteFavorite,
  getWatchlist,
  addWatchlist,
  deleteWatchlist,
};