const jwt = require('jsonwebtoken');
const tokenModel = require('../models/tokenModel');

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

module.exports = {
  generateTokens,
  saveToken,
  findToken,
  deleteToken,
};
