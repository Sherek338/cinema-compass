import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

import UserDTO from '../dtos/UserDTO.js';
import UserModel from '../models/UserModel.js';
import tokenService from './tokenService.js';
import mailService from './mailService.js';
import ApiError from '../exceptions/ApiError.js';

const registration = async (username, email, password) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userExists = await UserModel.findOne({ email }).session(session);
    if (userExists) {
      throw ApiError.BadRequest('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const activationLink = uuidv4();

    const [newUser] = await UserModel.create(
      [
        {
          username,
          email,
          password: hashedPassword,
          activationLink,
        },
      ],
      { session }
    );

    const result = await generateDtoAndTokens(newUser, session);
    await session.commitTransaction();

    mailService.sendActivationLink(
      email,
      `${process.env.CLIENT_URL}/activate/${activationLink}`
    );

    return result;
  } catch (e) {
    await session.abortTransaction();
    throw e;
  } finally {
    session.endSession();
  }
};

const login = async (email, password) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw ApiError.BadRequest('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw ApiError.BadRequest('Invalid email or password');
  }

  if (!user.isActivated) {
    throw ApiError.BadRequest('Account is not activated');
  }

  return await generateDtoAndTokens(user);
};

const logout = async (refreshToken) => {
  if (!refreshToken) {
    throw ApiError.BadRequest('Refresh token is required');
  }

  const result = await tokenService.deleteToken(refreshToken);
  if (!result.deletedCount) {
    throw ApiError.NotFound('Token not found or already deleted');
  }
};

const activate = async (activationLink) => {
  const user = await UserModel.findOne({ activationLink });
  if (!user) {
    throw ApiError.BadRequest('Invalid activation link');
  }

  user.isActivated = true;
  await user.save();

  return user.isActivated;
};

const refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw ApiError.BadRequest('Refresh token is required');
  }
  const payload = tokenService.validateRefreshToken(refreshToken);
  if (!payload) {
    throw ApiError.BadRequest('Invalid refresh token');
  }

  const tokenModel = await tokenService.findToken(refreshToken);
  if (!tokenModel) {
    throw ApiError.BadRequest('');
  }

  const user = await UserModel.findById(tokenModel.user);
  if (!user) {
    await tokenService.deleteToken(refreshToken);
    throw ApiError.BadRequest('User not found');
  }

  const result = await generateDtoAndTokens(user);
  await tokenService.deleteToken(refreshToken);
  return result;
};

const sendMail = async (email, link) => {
  if (!email || !link) {
    throw ApiError.BadRequest('Email and link are required');
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw ApiError.BadRequest('User not found');
  }

  mailService.sendActivationLink(email, link);
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
  sendMail,
};