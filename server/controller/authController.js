import authService from '../services/authService.js';

const refreshTokenMaxAge = 2592000000;
const cookieOptions = {
  maxAge: refreshTokenMaxAge,
  httpOnly: true,
  secure: process.env.MODE === 'production',
  sameSite: 'strict',
};

const registration = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const userData = await authService.registration(username, email, password);

    res.cookie('refreshToken', userData.refreshToken, cookieOptions);
    res.status(201).json(userData);
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userData = await authService.login(email, password);

    res.cookie('refreshToken', userData.refreshToken, cookieOptions);
    res.status(200).json(userData);
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    await authService.logout(refreshToken);

    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (e) {
    next(e);
  }
};

const activate = async (req, res, next) => {
  try {
    const { link } = req.params;
    await authService.activate(link);

    res.status(200).json({
      message: 'Account activated successfully',
    });
  } catch (e) {
    next(e);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const userData = await authService.refresh(refreshToken);

    res.cookie('refreshToken', userData.refreshToken, cookieOptions);
    res.status(200).json(userData);
  } catch (e) {
    next(e);
  }
};

export default {
  login,
  registration,
  logout,
  activate,
  refresh,
};
