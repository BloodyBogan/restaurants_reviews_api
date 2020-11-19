'use strict';

const path = require('path');
const assert = require('assert');
const express = require('express');
const cors = require('cors');
const Ddos = require('ddos');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const ddos = new Ddos({
  burst: 10,
  limit: 15,
  errormessage: {
    success: false,
    message: 'Too many requests, please try again later',
  },
});

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
});

// Colors for the console
require('colors');

// Load Enviromental Variables
require('dotenv').config({
  path: path.join(__dirname, 'config', 'config.env'),
});

// Database connection
const { databaseConnection } = require('./config/Sequelize.config');

// Initialize app
const app = express();

// Helmet Middleware
app.use(helmet());

// CORS
const { ORIGIN } = process.env;
assert(ORIGIN, 'ORIGIN is required');

const corsOptionsDelegate = (req, callback) => {
  console.log('Checking origin for ', req.header('Origin'));

  let corsOptions;
  const isOriginAllowed = req.header('Origin') === ORIGIN;
  if (isOriginAllowed) {
    corsOptions = {
      origin: true,
      optionsSuccessStatus: 200, // Legacy browser support
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    };
  } else {
    corsOptions = {
      origin: false,
    };
  }
  callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));
app.options('*', cors(corsOptionsDelegate));

// If behind a reverse proxy
app.set('trust proxy', 1);

app.use(ddos.express);
app.use(limiter);

// Body parser middleware
app.use(express.json());

const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  app.use(require('volleyball'));
}

// Set the static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/v1', require('./routes/Api.route'));

// 404
function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not Found - ' + req.originalUrl);

  next(error);
}

// Error Handler
function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    success: false,
    message: err.message,
    stack: isProduction ? {} : err.stack,
  });
}

app.use(notFound);
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
databaseConnection(() => {
  app.listen(PORT, () => {
    console.log(
      `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
        .bold
    );
  });
});
