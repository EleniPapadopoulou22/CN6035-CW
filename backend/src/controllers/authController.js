const authService = require('../services/authService');

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες.',
      });
    }

    const user = await authService.register(name, email, password);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  } catch (error) {
    if (error.message === 'EMAIL_EXISTS') {
      return res.status(409).json({
        success: false,
        message: 'Υπάρχει ήδη χρήστης με αυτό το email, παρακαλώ συνθεθείτε.',
      });
    }

    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const result = await authService.login(email, password);

    res.json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    if (error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
}

async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    const tokens = await authService.refreshAccessToken(refreshToken);

    res.json({
      success: true,
      data: tokens,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token',
    });
  }
}

module.exports = {
  register,
  login,
  refresh,
};