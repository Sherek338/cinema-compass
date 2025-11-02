import authService from '../services/authService.js';

const registration = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const userData = await authService.registration(username, email, password);

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.status(201).json(userData);
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userData = await authService.login(email, password);

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

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

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

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
