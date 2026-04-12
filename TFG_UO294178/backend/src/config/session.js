const session = require('express-session');
const { SESSION_SECRET, NODE_ENV } = require('./env');

module.exports = session({
  secret: SESSION_SECRET,
  name: 'sergas_session',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
  },
});