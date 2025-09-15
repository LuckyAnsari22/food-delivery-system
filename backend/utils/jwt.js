const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Generate refresh token
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Decode JWT token without verification
const decodeToken = (token) => {
  return jwt.decode(token);
};

// Generate token for user
const generateUserToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role
  };

  return {
    token: generateToken(payload),
    refreshToken: generateRefreshToken(payload),
    expiresIn: process.env.JWT_EXPIRE || '7d'
  };
};

// Send token response
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const tokenData = generateUserToken(user);

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.status(statusCode)
    .cookie('token', tokenData.token, options)
    .json({
      success: true,
      message,
      token: tokenData.token,
      refreshToken: tokenData.refreshToken,
      expiresIn: tokenData.expiresIn,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  decodeToken,
  generateUserToken,
  sendTokenResponse
};
