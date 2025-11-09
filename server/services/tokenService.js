import jwt from 'jsonwebtoken';
import tokenModel from '../models/TokenModel.js';

const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '30m',
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  });
  return { accessToken, refreshToken };
};

const saveToken = async (UserID, refreshToken) => {
  await tokenModel.deleteMany({
    user: UserID,
    createdAt: { $lt: new Date(Date.now() - 2592000) },
  });

  const numberOfTokens = await tokenModel.countDocuments({ user: UserID });
  if (numberOfTokens >= 5) {
    const oldToken = await tokenModel
      .findOne({ user: UserID })
      .sort({ createdAt: 1 });
    await tokenModel.deleteOne({ _id: oldToken._id });
  }
  const newToken = await tokenModel.create({
    user: UserID,
    refreshToken,
    createdAt: new Date(),
  });
  return newToken;
};

const findToken = async (refreshToken) => {
  const tokenData = await tokenModel.findOne({ refreshToken });
  return tokenData;
};

const deleteToken = async (refreshToken) => {
  await tokenModel.deleteOne({ refreshToken });
};

const validateRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (e) {
    return null;
  }
};

export default {
  generateTokens,
  saveToken,
  findToken,
  deleteToken,
  validateRefreshToken,
};
