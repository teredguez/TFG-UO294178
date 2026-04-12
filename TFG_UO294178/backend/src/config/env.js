require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:4200',
  SESSION_SECRET: process.env.SESSION_SECRET || 'dev_secret',
  NODE_ENV: process.env.NODE_ENV || 'development',
};