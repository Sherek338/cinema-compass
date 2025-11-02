import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import UserDTO from '../dtos/UserDTO.js';
import UserModel from '../models/UserModel.js';
import tokenService from './tokenService.js';
import mailService from './mailService.js';

const registration = async (username, email, password) => {
  const userExists = await UserModel.findOne({ email });
  if (userExists) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const activationLink = uuidv4();

  const newUser = await UserModel.create({
    username,
    email,
    password: hashedPassword,
    activationLink,
  });

  await mailService.sendActivationLink(
    email,
    `${process.env.API_URL}/api/auth/activate/${activationLink}`
  );

  return generateDtoAndTokens(newUser);
};

const login = async (email, password) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }
  if (!user.isActivated) {
    throw new Error('Account is not activated');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  return generateDtoAndTokens(user);
};

const logout = async (refreshToken) => {
  const tokenData = await tokenService.findToken(refreshToken);
  if (!tokenData) {
    throw new Error('Token not found');
  }

  await tokenService.deleteToken(refreshToken);
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

export default {
  registration,
  login,
  logout,
  activate,
  refresh,
};
