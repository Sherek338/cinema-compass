const bcrypt = require('bcrypt');
const uuid = require('uuid');
const UserDTO = require('../dtos/UserDTO');
const UserModel = require('../models/UserModel');
const { validateUsername, validateEmail } = require('../libs/utils');
const tokenService = require('./tokenService');
const mailService = require('./mailService');

const registration = async (username, email, password) => {
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
};
const login = async (email, password) => {
  if (validateEmail(email) || !password) {
    throw new Error('All fields are required');
  }

  //TODO
};
const logout = async (refreshToken) => {
  // Logic for user logout
};
const activate = async (activationLink) => {
  const user = await UserModel.findOne({ activationLink });
  if (!user) {
    throw new Error('Invalid activation link');
  }
  if (user.isActivated) {
    throw new Error('Account is already activated');
  }

  user.isActivated = true;
  await user.save();
};
const refresh = async (refreshToken) => {
  // Logic for token refresh
};

module.exports = {
  registration,
  login,
  logout,
  activate,
  refresh,
};
