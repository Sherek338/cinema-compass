import UserModel from "../models/UserModel.js";
import ApiError from "../exceptions/ApiError.js";

export const getUserLists = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id)
      .select("favoriteList watchList")
      .lean();
    if (!user) throw ApiError.NotFound("User not found");

    res.status(200).json({
      favoriteList: user.favoriteList || [],
      watchList: user.watchList || [],
    });
  } catch (e) {
    next(e);
  }
};

export const updateWatchlist = async (req, res, next) => {
  try {
    const { movieId, action } = req.body;
    if (!movieId || !["add", "remove"].includes(action)) {
      throw ApiError.BadRequest("movieId and valid action are required");
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) throw ApiError.NotFound("User not found");

    if (action === "add" && !user.watchList.includes(movieId)) {
      user.watchList.push(movieId);
    } else if (action === "remove") {
      user.watchList = user.watchList.filter((id) => id !== movieId);
    }

    await user.save();
    res.status(200).json({ watchList: user.watchList });
  } catch (e) {
    next(e);
  }
};

export const updateFavorites = async (req, res, next) => {
  try {
    const { movieId, action } = req.body;
    if (!movieId || !["add", "remove"].includes(action)) {
      throw ApiError.BadRequest("movieId and valid action are required");
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) throw ApiError.NotFound("User not found");

    if (action === "add" && !user.favoriteList.includes(movieId)) {
      user.favoriteList.push(movieId);
    } else if (action === "remove") {
      user.favoriteList = user.favoriteList.filter((id) => id !== movieId);
    }

    await user.save();
    res.status(200).json({ favoriteList: user.favoriteList });
  } catch (e) {
    next(e);
  }
};
