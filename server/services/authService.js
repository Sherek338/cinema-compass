const bcrypt = require('bcrypt');
const uuid = require('uuid');
const UserDTO = require('../dtos/UserDTO');
const UserModel = require('../models/UserModel');
const { validateUsername, validateEmail } = require('../libs/utils');
const tokenService = require('./tokenService');
const mailService = require('./mailService');

class AuthService {
  async registration(username, email, password) {
    if (!validateUsername(username) || !validateEmail(email) || !password) {
      throw new Error('All fields are required');
    }
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const activationLink = uuid.v4();

    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      activationLink,
    });

    await mailService.sendActivationLink(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    );

    const userDTO = new UserDTO(newUser);
    const tokens = tokenService.generateTokens({ ...userDTO });
    await tokenService.saveToken(userDTO.id, tokens.refreshToken);

    return { ...tokens, user: userDTO };
  }
  async login(email, password) {
    if (validateEmail(email) || !password) {
      throw new Error('All fields are required');
    }

    //TODO
  }
  async logout(refreshToken) {
    // Logic for user logout
  }
  async activate(activationLink) {
    // Logic for account activation
  }
  async refresh(refreshToken) {
    // Logic for token refresh
  }
}

module.exports = new AuthService();
