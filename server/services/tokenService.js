const jwt = require('jsonwebtoken');
const tokenModel = require('../models/tokenModel');

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '30m',
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    });
    return { accessToken, refreshToken };
  }

  async saveToken(UserID, refreshToken) {
    const token = await tokenModel.findOne({ user: UserID });
    if (token) {
      token.refreshToken = refreshToken;
      return token.save();
    }
    const newToken = await tokenModel.create({ user: UserID, refreshToken });
    return newToken;
  }
}

module.exports = new TokenService();
