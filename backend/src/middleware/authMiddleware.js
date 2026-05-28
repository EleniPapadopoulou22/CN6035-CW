const jwt = require('jsonwebtoken');

// Verifies the JWT access token before protected routes.
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token is required',
    });
  }

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (error, user) => {
    if (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired',
          code: 'TOKEN_EXPIRED',
        });
      }

      return res.status(403).json({
        success: false,
        message: 'Invalid token',
      });
    }

    req.user = user;
    next();
  });
}

module.exports = {
  authenticateToken,
};