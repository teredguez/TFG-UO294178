const express = require('express');
const helmet = require('helmet');

const corsMiddleware = require('./config/cors');
const sessionMiddleware = require('./config/session');
const configurePassport = require('./config/passport');
const { globalLimiter } = require('./middlewares/rate-limit.middleware');
const errorMiddleware = require('./middlewares/error.middleware');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const reportRoutes = require('./routes/report.routes');

const app = express();

app.use(corsMiddleware);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

configurePassport(app);
app.use(globalLimiter);

app.use('/api', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);

app.use(errorMiddleware);


module.exports = app;