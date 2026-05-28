const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const SALT_ROUNDS = 10;

function generateTokens(user) {
  const payload = {
    user_id: user.user_id,
    email: user.email,
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' }
  );

  return { accessToken, refreshToken };
}

async function register(name, email, password) {
  const [existingUsers] = await pool.query(
    'SELECT user_id FROM users WHERE email = ?',
    [email]
  );

  if (existingUsers.length > 0) {
    throw new Error('EMAIL_EXISTS');
  }

  // Κρυπτογράφηση του κωδικού πρόσβασης πριν την αποθήκευση στη βάση δεδομένων
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const [result] = await pool.query(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, passwordHash]
  );

  return {
    user_id: result.insertId,
    name,
    email,
  };
}

async function login(email, password) {
  const [rows] = await pool.query(
    'SELECT user_id, name, email, password_hash FROM users WHERE email = ?',
    [email]
  );

  if (rows.length === 0) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const user = rows[0];
  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const safeUser = {
    user_id: user.user_id,
    name: user.name,
    email: user.email,
  };

  return {
    user: safeUser,
    ...generateTokens(safeUser),
  };
}

async function refreshAccessToken(refreshToken) {
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const [rows] = await pool.query(
      'SELECT user_id, name, email FROM users WHERE user_id = ?',
      [payload.user_id]
    );

    if (rows.length === 0) {
      throw new Error('INVALID_REFRESH_TOKEN');
    }

    return generateTokens(rows[0]);
  } catch (error) {
    throw new Error('INVALID_REFRESH_TOKEN');
  }
}

module.exports = {
  register,
  login,
  refreshAccessToken,
};