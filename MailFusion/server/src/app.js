const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();

const allowedOrigins = new Set([
  env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests (no Origin header) and configured local dev origins.
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      return callback(new Error('CORS origin not allowed'));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
  })
);

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
