const cors = require('cors');
const { FRONTEND_URL } = require('./env');

module.exports = cors({
  origin: FRONTEND_URL,
  credentials: true,
});