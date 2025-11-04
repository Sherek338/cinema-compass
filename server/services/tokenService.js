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
  const token = await tokenModel.findOne({ user: UserID });
  if (token) {
    token.refreshToken = refreshToken;
    return token.save();
  }
  const newToken = await tokenModel.create({ user: UserID, refreshToken });
  return newToken;
};

const findToken = async (refreshToken) => {
  const tokenData = await tokenModel.findOne({ refreshToken });
  return tokenData;
};

const deleteToken = async (refreshToken) => {
  await tokenModel.deleteOne({ refreshToken });
};

const verifyToken = (token, type) => {
  try {
    const secret =
      type === 'access'
        ? process.env.JWT_ACCESS_SECRET
        : process.env.JWT_REFRESH_SECRET;
    const userData = jwt.verify(token, secret);
    return userData;
  } catch (e) {
    return null;
  }
};

export default {
  generateTokens,
  saveToken,
  findToken,
  deleteToken,
  verifyToken,
};
