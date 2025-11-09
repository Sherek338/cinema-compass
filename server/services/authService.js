import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import UserDTO from '../dtos/UserDTO.js';
import UserModel from '../models/UserModel.js';
import tokenService from './tokenService.js';
import mailService from './mailService.js';
import ApiError from '../exceptions/ApiError.js';

const registration = async (username, email, password) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      throw new ApiError.BadRequest('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const activationLink = uuidv4();

    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      activationLink,
    });

    const result = generateDtoAndTokens(newUser);
    await session.commitTransaction();

    mailService.sendActivationLink(
      email,
      `${process.env.API_URL}/api/auth/activate/${activationLink}`
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

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!user && !isPasswordValid) {
    throw new ApiError.BadRequest('Invalid email or password');
  }

  if (!user.isActivated) {
    throw new ApiError.BadRequest('Account is not activated');
  }

  return generateDtoAndTokens(user);
};

const logout = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError.BadRequest('Refresh token is required');
  }

  const result = await tokenService.deleteToken(refreshToken);
  if (!result.deletedCount) {
    throw new ApiError.NotFound('Token not found or already deleted');
  }
};

const activate = async (activationLink) => {
  const user = await UserModel.findOne({ activationLink });
  if (!user) {
    throw new ApiError.BadRequest('Invalid activation link');
  }
  if (user.isActivated) {
    throw new ApiError.BadRequest('Account is already activated');
  }

  user.isActivated = true;
  await user.save();
};

const refresh = async (refreshToken) => {
  const tokenModel = await tokenService.findToken(refreshToken);
  if (!tokenModel) {
    throw new ApiError.Unathorized();
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
