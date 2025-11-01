const authService = require('../services/authService');

const registration = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const userData = await authService.registration(username, email, password);

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.json(userData);
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    res.send('Login successful');
  } catch (e) {}
};

const logout = async (req, res, next) => {
  try {
  } catch (e) {}
};

const activate = async (req, res, next) => {
  try {
    const { link } = req.params;
    await authService.activate(link);

    res.status(200);
    res.json({
      message: 'Account activated successfully',
    });
  } catch (e) {}
};

const refresh = async (req, res, next) => {
  try {
  } catch (e) {}
};

module.exports = {
  login,
  registration,
  logout,
  activate,
  refresh,
};
