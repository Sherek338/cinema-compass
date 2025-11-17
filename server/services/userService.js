import ApiError from '../exceptions/ApiError.js';
import UserModel from '../models/UserModel.js';

const getFavorites = async (userId) => {
  if (!userId) {
    throw ApiError.BadRequest('User id is required');
  }

  const favoriteList = await UserModel.findById(userId).select('favoriteList');

  return favoriteList;
};

const updateFavorite = async (userId, newId) => {
  if (!userId || !newId) {
    throw ApiError.BadRequest('User id and Movie id are required');
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw ApiError.NotFound('User not found');
  }

  const index = user.favoriteList.findIndex(
    (item) => item.id === newId.id && item.type === newId.type
  );
  if (index !== -1) {
    throw ApiError.Conflict('Movie already in favorites');
  }

  user.favoriteList.push(newId);
  await user.save();
  return user.favoriteList;
};

const deleteFavorite = async (userId, newId) => {
  if (!userId || !newId) {
    throw ApiError.BadRequest('User id and Movie id are required');
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw ApiError.NotFound('User not found');
  }

  const indexD = user.favoriteList.findIndex(
    (item) => item.id === newId.id && item.type === newId.type
  );
  if (indexD === -1) {
    throw ApiError.NotFound('Movie not found in favorites');
  }

  user.favoriteList = user.favoriteList.filter((_, index) => index !== indexD);
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

const updateWatchlist = async (userId, newId) => {
  if (!userId || !newId) {
    throw ApiError.BadRequest('User id and Movie id are required');
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw ApiError.NotFound('User not found');
  }

  const index = user.watchList.findIndex(
    (item) => item.id === newId.id && item.type === newId.type
  );
  if (index !== -1) {
    throw ApiError.Conflict('Movie already in watchlist');
  }

  user.watchList.push(newId);
  await user.save();
  return user.watchList;
};

const deleteWatchlist = async (userId, newId) => {
  if (!userId || !newId) {
    throw ApiError.BadRequest('User id and Movie id are required');
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw ApiError.NotFound('User not found');
  }

  const indexD = user.watchList.findIndex(
    (item) => item.id === newId.id && item.type === newId.type
  );
  if (indexD === -1) {
    throw ApiError.NotFound('Movie not found in watchlist');
  }

  user.watchList = user.watchList.filter((_, index) => index !== indexD);
  await user.save();
  return user.watchList;
};

export default {
  getFavorites,
  updateFavorite,
  deleteFavorite,
  getWatchlist,
  updateWatchlist,
  deleteWatchlist,
};
