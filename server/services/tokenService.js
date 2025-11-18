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


const saveToken = async (userId, refreshToken, meta = {}) => {
  await tokenModel.findOneAndUpdate(
    { user: userId },
    {
      user: userId,
      refreshToken,
      userAgent: meta.userAgent || undefined,
      ip: meta.ip || undefined,
      createdAt: new Date(),
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );
};


const findToken = async (refreshToken) => {
  return tokenModel.findOne({ refreshToken });
};


const deleteToken = async (refreshToken) => {
  await tokenModel.deleteOne({ refreshToken });
};

const validateRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
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
