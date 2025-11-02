const bcrypt = require('bcrypt');
const uuid = require('uuid');
const UserDTO = require('../dtos/UserDTO');
const UserModel = require('../models/UserModel');
const tokenService = require('./tokenService');
const mailService = require('./mailService');

const registration = async (username, email, password) => {
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

  return generateDtoAndTokens(newUser);
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
  const tokenModel = await tokenService.findToken(refreshToken);
  if (!tokenModel) {
    throw new Error('Unauthorized');
  }

  const user = await UserModel.findById(tokenModel.user);

  return generateDtoAndTokens(user);
};

const generateDtoAndTokens = async (user) => {
  const userDTO = new UserDTO(user);
  const tokens = tokenService.generateTokens({ ...userDTO });
  await tokenService.saveToken(userDTO.id, tokens.refreshToken);
  return { ...tokens, user: userDTO };
};

module.exports = {
  registration,
  login,
  logout,
  activate,
  refresh,
};
