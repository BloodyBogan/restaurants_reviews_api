'use strict';

const path = require('path');
const assert = require('assert');
const express = require('express');
const passport = require('passport');
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

// CORS
const { ORIGIN } = process.env;
assert(ORIGIN, 'ORIGIN is required');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', ORIGIN);
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(200).send();
  } else {
    next();
  }
});

// Helmet Middleware
app.use(helmet());
const frameguard = require('frameguard');
app.use(frameguard());
const xssFilter = require('x-xss-protection');
app.use(xssFilter());
const ienoopen = require('ienoopen');
app.use(ienoopen());
const nosniff = require('dont-sniff-mimetype');
app.use(nosniff());
app.disable('x-powered-by');

// If behind a reverse proxy
app.set('trust proxy', 1);

app.use(ddos.express);
app.use(limiter);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  app.use(require('volleyball'));
}

// Passport
app.use(passport.initialize());
require('./config/Passport.config')(passport);

// Set the static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/auth', require('./routes/Auth.route'));
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
