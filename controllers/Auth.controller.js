'use strict';

const assert = require('assert');
const jwt = require('jsonwebtoken');
const { User } = require('../config/Sequelize.config');
const {
  signupUserSchema,
  loginUserSchema,
} = require('../config/Validation.config');

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;
assert(JWT_SECRET, 'JWT_SECRET is required');
assert(JWT_EXPIRES_IN, 'JWT_EXPIRES_IN is required');

const isProduction = process.env.NODE_ENV === 'production';

exports.postSignup = async (req, res) => {
  try {
    const validationResult = await signupUserSchema.validateAsync(req.body);

    await User.create(validationResult);

    res.status(201).json({
      success: true,
      message: 'Account has been successfully registered',
    });
  } catch (error) {
    if (error.original && error.original.code === 'ER_DUP_ENTRY') {
      error.message = 'Email already registered';

      res.status(422);
    }

    if (error.details) {
      res.status(422);
    }

    if (!(res.statusCode === 422)) {
      res.status(500);
    }

    res.status(res.statusCode || 500).json({
      success: false,
      message:
        res.statusCode === 500 ? 'There was a server error' : error.message,
      stack: isProduction ? {} : error.stack,
    });
  }
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = await loginUserSchema.validateAsync(req.body);

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(422);
      throw new Error('Invalid credentials');
    }

    const isMatch = await user.comparePasswords(password);
    if (isMatch) {
      const token = jwt.sign(
        { username: user.username, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return res.status(200).json({
        success: true,
        message: 'You have been successfully logged in',
        token: 'JWT ' + token,
      });
    }

    res.status(422);
    throw new Error('Invalid credentials');
  } catch (error) {
    if (error.details) {
      res.status(422);
    }

    if (!(res.statusCode === 422)) {
      res.status(500);
    }

    res.status(res.statusCode || 500).json({
      success: false,
      message:
        res.statusCode === 500 ? 'There was a server error' : error.message,
      stack: isProduction ? {} : error.stack,
    });
  }
};
