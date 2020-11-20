'use strict';

const Joi = require('joi');

//
// Restaurants
//
exports.postRestaurantSchema = Joi.object({
  name: Joi.string().empty().trim().max(255).required().messages({
    'string.base': 'Restaurant name must be a type of text',
    'string.empty': 'Restaurant name must not be empty',
    'string.max': 'Restaurant name must not be longer than 255 characters',
    'any.required': 'Restaurant name is required',
  }),
  description: Joi.string()
    .empty()
    .trim()
    .min(60)
    .max(500)
    .required()
    .messages({
      'string.base': 'Restaurant description must be a type of text',
      'string.empty': 'Restaurant description must not be empty',
      'string.min':
        'Restaurant description must be at least 60 characters long',
      'string.max':
        'Restaurant description must not be longer than 255 characters',
      'any.required': 'Restaurant description is required',
    }),
  location: Joi.string().empty().trim().max(255).required().messages({
    'string.base': 'Restaurant location must be a type of text',
    'string.empty': 'Restaurant location must not be empty',
    'string.max': 'Restaurant location must not be longer than 255 characters',
    'any.required': 'Restaurant location is required',
  }),
  website: Joi.string().empty().trim().uri().max(255).required().messages({
    'string.base': 'Restaurant website must be a type of text',
    'string.empty': 'Restaurant website must not be empty',
    'string.uri': 'Restaurant website must be a valid URL',
    'string.max': 'Restaurant website must not be longer than 255 characters',
    'any.required': 'Restaurant website is required',
  }),
  imageUrl: Joi.string().empty().trim().uri().max(255).messages({
    'string.base': 'Restaurant image URL must be a type of text',
    'string.empty': 'Restaurant image URL must not be empty',
    'string.uri': 'Restaurant image URL must be a valid URL',
    'string.max': 'Restaurant image URL must not be longer than 255 characters',
  }),
});

exports.patchRestaurantSchema = Joi.object({
  name: Joi.string().empty().trim().max(255).messages({
    'string.base': 'Restaurant name must be a type of text',
    'string.empty': 'Restaurant name must not be empty',
    'string.max': 'Restaurant name must not be longer than 255 characters',
  }),
  description: Joi.string()
    .empty()
    .trim()
    .min(60)
    .max(500)

    .messages({
      'string.base': 'Restaurant description must be a type of text',
      'string.empty': 'Restaurant description must not be empty',
      'string.min':
        'Restaurant description must be at least 60 characters long',
      'string.max':
        'Restaurant description must not be longer than 255 characters',
    }),
  location: Joi.string().empty().trim().max(255).messages({
    'string.base': 'Restaurant location must be a type of text',
    'string.empty': 'Restaurant location must not be empty',
    'string.max': 'Restaurant location must not be longer than 255 characters',
  }),
  website: Joi.string().empty().trim().uri().max(255).messages({
    'string.base': 'Restaurant website must be a type of text',
    'string.empty': 'Restaurant website must not be empty',
    'string.uri': 'Restaurant website must be a valid URL',
    'string.max': 'Restaurant website must not be longer than 255 characters',
  }),
  imageUrl: Joi.string().empty().trim().uri().max(255).messages({
    'string.base': 'Restaurant image URL must be a type of text',
    'string.empty': 'Restaurant image URL must not be empty',
    'string.uri': 'Restaurant image URL must be a valid URL',
    'string.max': 'Restaurant image URL must not be longer than 255 characters',
  }),
});

//
// Reviews
//
exports.postReviewSchema = Joi.object({
  restaurant_id: Joi.number().empty().required().messages({
    'number.base': 'Restaurant ID must be a type of number',
    'number.empty': 'Restaurant ID must not be empty',
    'any.required': 'Restaurant ID is required',
  }),
  rating: Joi.string()
    .empty()
    .trim()
    .valid('1', '2', '3', '4', '5')
    .required()
    .messages({
      'string.base': 'Review rating must be a type of text',
      'string.empty': 'Review rating must not be empty',
      'any.only': 'Invalid review rating',
      'any.required': 'Review rating is required',
    }),
  review: Joi.string().empty().trim().min(25).max(500).required().messages({
    'string.base': 'Review body must be a type of text',
    'string.empty': 'Review body must not be empty',
    'string.min': 'Review body must be at least 25 characters long',
    'string.max': 'Review body must not be longer than 500 characters',
    'any.required': 'Review body is required',
  }),
  name: Joi.string().empty().trim().max(255).messages({
    'string.base': 'Review name must be a type of text',
    'string.empty': 'Review name must not be empty',
    'string.max': 'Review name must not be longer than 255 characters',
  }),
});

exports.patchReviewSchema = Joi.object({
  rating: Joi.string().empty().trim().valid('1', '2', '3', '4', '5').messages({
    'string.base': 'Review rating must be a type of text',
    'string.empty': 'Review rating must not be empty',
    'any.only': 'Invalid review rating',
  }),
  review: Joi.string().empty().trim().min(25).max(500).messages({
    'string.base': 'Review body must be a type of text',
    'string.empty': 'Review body must not be empty',
    'string.min': 'Review body must be at least 25 characters long',
    'string.max': 'Review body must not be longer than 500 characters',
  }),
  name: Joi.string().empty().trim().max(255).messages({
    'string.base': 'Review name must be a type of text',
    'string.empty': 'Review name must not be empty',
    'string.max': 'Review name must not be longer than 255 characters',
  }),
});

//
// Users
//
exports.signupUserSchema = Joi.object({
  username: Joi.string()
    .empty()
    .trim()
    .alphanum()
    .min(3)
    .max(255)
    .required()
    .messages({
      'string.base': 'Username must be a type of text',
      'string.empty': 'Username must not be empty',
      'string.alphanum': 'Username must only contain a-z, A-Z, and 0-9',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username must not be longer than 255 characters',
      'any.required': 'Username is required',
    }),
  email: Joi.string().empty().trim().email().max(255).required().messages({
    'string.base': 'Email must be a type of text',
    'string.empty': 'Email must not be empty',
    'string.email': 'Email must be a valid email address',
    'string.max': 'Email must not be longer than 255 characters',
    'any.required': 'Email is required',
  }),
  password: Joi.string().empty().trim().min(8).max(255).required().messages({
    'string.base': 'Password must be a type of text',
    'string.empty': 'Password must not be empty',
    'string.min': 'Password must be at least 8 characters long',
    'string.max': 'Password must not be longer than 255 characters',
    'any.required': 'Password is required',
  }),
  confirmPassword: Joi.any()
    .valid(Joi.ref('password'))
    .required()
    .messages({ 'any.only': 'Passwords do not match' }),
});

exports.loginUserSchema = Joi.object({
  email: Joi.string().empty().trim().required().messages({
    'string.base': 'Email must be a type of text',
    'string.empty': 'Email must not be empty',
    'any.required': 'Email is required',
  }),
  password: Joi.string().empty().trim().required().messages({
    'string.base': 'Password must be a type of text',
    'string.empty': 'Password must not be empty',
    'any.required': 'Password is required',
  }),
});
