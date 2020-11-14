'use strict';

const Sequelize = require('sequelize');
const { Restaurant, Review } = require('../config/Sequelize.config');

const isProduction = process.env.NODE_ENV === 'production';

//
// Restaurants
//

// @desc  Get all restaurants
// @route GET /api/v1/restaurants
// @access Public
exports.getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      attributes: {
        include: [
          [
            Sequelize.fn('COUNT', Sequelize.col('reviews.review_id')),
            'review_count',
          ],
          [
            Sequelize.fn(
              'ROUND',
              Sequelize.fn('AVG', Sequelize.col('reviews.rating')),
              1
            ),
            'rating',
          ],
        ],
      },
      include: [
        {
          model: Review,
          as: 'reviews',
          attributes: [],
        },
      ],
      group: ['restaurant.restaurant_id'],
    });

    return res.status(200).json({
      success: true,
      data: restaurants,
      count: restaurants.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: res.status === 500 ? 'There was a server error' : error.message,
      stack: isProduction ? {} : error.stack,
    });
  }
};

// @desc  Get single restaurant
// @route GET /api/v1/restaurants/:id
// @access Public
exports.getRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findOne({
      where: { restaurant_id: id },
      attributes: {
        include: [
          [
            Sequelize.fn('COUNT', Sequelize.col('reviews.review_id')),
            'review_count',
          ],
          [
            Sequelize.fn(
              'ROUND',
              Sequelize.fn('AVG', Sequelize.col('reviews.rating')),
              1
            ),
            'rating',
          ],
        ],
      },
      include: [
        {
          model: Review,
          as: 'reviews',
          attributes: [],
        },
      ],
      group: ['restaurant.restaurant_id'],
    });
    if (!restaurant) {
      res.status(404);
      throw new Error(`Restaurant with ID ${id} doesn't exist`);
    }

    const reviews = await Review.findAll({
      where: { restaurant_id: restaurant.restaurant_id },
      attributes: {
        exclude: ['restaurant_id'],
      },
    });

    restaurant.dataValues.reviews = reviews;

    return res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    if (!res.statusCode === 404) {
      res.status(500);
    }

    return res.status(res.statusCode || 500).json({
      success: false,
      message: res.status === 500 ? 'There was a server error' : error.message,
      stack: isProduction ? {} : error.stack,
    });
  }
};

// @desc  Add restaurant
// @route POST /api/v1/restaurants
// @access Public
exports.addRestaurant = async (req, res) => {
  for (let key in req.body) {
    key = key.trim().toString();
  }

  try {
    let { name, description, location, website } = req.body;

    if (name === '') {
      res.status(422);
      throw new Error('Restaurant name is required');
    }

    if (description === '') {
      res.status(422);
      throw new Error('Restaurant description is required');
    }

    if (location === '') {
      res.status(422);
      throw new Error('Restaurant location is required');
    }

    if (website === '') {
      res.status(422);
      throw new Error('Restaurant location is required');
    }

    if (name.length > 255) {
      res.status(422);
      throw new Error('Restaurant name must not be longer than 255 characters');
    }

    if (description.length > 500) {
      res.status(422);
      throw new Error(
        'Restaurant description must not be longer than 500 characters'
      );
    }

    if (location.length > 255) {
      res.status(422);
      throw new Error(
        'Restaurant location must not be longer than 255 characters'
      );
    }

    if (website.length > 255) {
      res.status(422);
      throw new Error(
        'Restaurant website must not be longer than 255 characters'
      );
    }

    const expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    const regex = new RegExp(expression);

    if (!regex.test(website)) {
      res.status(422);
      throw new Error('Restaurant website must not be a valid URL');
    }

    if (req.body.imageUrl) {
      if (req.body.imageUrl === '') {
        res.status(422);
        throw new Error('Restaurant image URL must not be empty');
      }

      if (req.body.imageUrl.length > 255) {
        res.status(422);
        throw new Error(
          'Restaurant image URL must not be longer than 255 characters'
        );
      }

      if (!regex.test(imageUrl)) {
        res.status(422);
        throw new Error('Restaurant image URL must not be a valid URL');
      }
    }

    const restaurant = await Restaurant.create(req.body);

    return res.status(201).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    if (error.original && error.original.code === 'ER_DUP_ENTRY') {
      error.message = 'This reastaurant is already in the database';

      res.status(422);
    }

    if (!res.statusCode === 422) {
      res.status(500);
    }

    return res.status(res.statusCode || 500).json({
      success: false,
      message: res.status === 500 ? 'There was a server error' : error.message,
      stack: isProduction ? {} : error.stack,
    });
  }
};

// @desc  Update restaurant
// @route PATCH /api/v1/restaurants/:id
// @access Public
exports.updateRestaurant = async (req, res) => {
  for (let key in req.body) {
    key = key.trim().toString();
  }

  try {
    const { id } = req.params;

    Object.keys(req.body).forEach(
      (key) =>
        req.body[key] == (null || undefined || '') && delete req.body[key]
    );

    if (Object.entries(req.body).length === 0) {
      return res.status(204).json({
        success: true,
        message: "Restaurant doesn't exist, or has nothing to be updated with",
      });
    }

    const restaurant = await Restaurant.findOne({
      where: { restaurant_id: id },
    });
    if (!restaurant) {
      res.status(404);
      throw new Error(`Restaurant with ID ${id} doesn't exist`);
    }

    const updatedRestaurant = await restaurant.update(req.body);

    // 204
    return res.status(200).json({
      success: true,
      data: updatedRestaurant,
    });
  } catch (error) {
    if (!res.statusCode === 404) {
      res.status(500);
    }

    return res.status(res.statusCode || 500).json({
      success: false,
      message: res.status === 500 ? 'There was a server error' : error.message,
      stack: isProduction ? {} : error.stack,
    });
  }
};

// @desc  Delete restaurant
// @route DELETE /api/v1/restaurants/:id
// @access Public
exports.deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findOne({
      where: { restaurant_id: id },
    });
    if (!restaurant) {
      res.status(404);
      throw new Error(`Restaurant with ID ${id} doesn't exist`);
    }
    await restaurant.destroy();

    await Review.destroy({
      where: { restaurant_id: id },
    });

    return res.status(200).json({
      success: true,
      message: `Restaurant ${restaurant.name} and all of its reviews were successfully deleted`,
    });
  } catch (error) {
    if (!res.statusCode === 404) {
      res.status(500);
    }

    return res.status(res.statusCode || 500).json({
      success: false,
      message: res.status === 500 ? 'There was a server error' : error.message,
      stack: isProduction ? {} : error.stack,
    });
  }
};

//
// Reviews
//

// @desc  Get all reviews
// @route GET /api/v1/reviews
// @access Public
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll();

    return res.status(200).json({
      success: true,
      data: reviews,
      count: reviews.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: res.status === 500 ? 'There was a server error' : error.message,
      stack: isProduction ? {} : error.stack,
    });
  }
};

// @desc  Get all reviews for a single restaurant
// @route GET /api/v1/reviews/restaurant/:id
// @access Public
exports.getReviewsForRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findOne({
      where: { restaurant_id: id },
    });
    if (!restaurant) {
      res.status(404);
      throw new Error(`Restaurant with ID ${id} doesn't exist`);
    }
    const reviews = await Review.findAll({
      where: { restaurant_id: id },
      attributes: { exclude: ['restaurant_id'] },
    });

    return res.status(200).json({
      success: true,
      data: {
        restaurant: {
          id: restaurant.restaurant_id,
          name: restaurant.name,
          description: restaurant.description,
        },
        reviews,
        count: reviews.length,
      },
    });
  } catch (error) {
    if (!res.statusCode === 404) {
      res.status(500);
    }

    return res.status(res.statusCode || 500).json({
      success: false,
      message: res.status === 500 ? 'There was a server error' : error.message,
      stack: isProduction ? {} : error.stack,
    });
  }
};

// @desc  Get single review
// @route GET /api/v1/reviews/:id
// @access Public
exports.getReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findOne({
      where: { review_id: id },
    });
    if (!review) {
      res.status(404);
      throw new Error(`Review with ID ${id} doesn't exist`);
    }

    return res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    if (!res.statusCode === 404) {
      res.status(500);
    }

    return res.status(res.statusCode || 500).json({
      success: false,
      message: res.status === 500 ? 'There was a server error' : error.message,
      stack: isProduction ? {} : error.stack,
    });
  }
};

// @desc  Add review
// @route POST /api/v1/reviews
// @access Public
exports.addReview = async (req, res) => {
  for (let key in req.body) {
    key = key.trim().toString();
  }

  try {
    const { restaurant_id, rating, review } = req.body;
    console.log(rating);
    if (restaurant_id === '') {
      res.status(422);
      throw new Error('Restaurant ID is required');
    }

    if (rating === '') {
      res.status(422);
      throw new Error('Rating is required');
    }

    if (review === '') {
      res.status(422);
      throw new Error('Review body is required');
    }

    if (!['1', '2', '3', '4', '5'].some((value) => value == rating)) {
      res.status(422);
      throw new Error('Invalid rating');
    }

    if (review.length > 500) {
      res.status(422);
      throw new Error('Review body must not be longer than 500 characters');
    }

    if (req.body.name) {
      if (req.body.name === '') {
        res.status(422);
        throw new Error('Name must not be empty');
      }

      if (req.body.name.length > 255) {
        res.status(422);
        throw new Error('Name must not be longer than 255 characters');
      }
    }

    const restaurant = await Restaurant.findOne({ where: { restaurant_id } });
    if (!restaurant) {
      res.status(404);
      throw new Error(`Restaurant with ID ${restaurant_id} doesn't exist`);
    }

    const createdReview = await Review.create(req.body);

    const reviewWithAssociations = await Review.findOne({
      where: { review_id: createdReview.review_id },
      include: {
        model: Restaurant,
        as: 'restaurant',
        attributes: ['name', 'description'],
      },
    });

    return res.status(201).json({
      success: true,
      data: reviewWithAssociations,
    });
  } catch (error) {
    if (!res.statusCode === 404 || !res.statusCode === 422) {
      res.status(500);
    }

    return res.status(res.statusCode || 500).json({
      success: false,
      message: res.status === 500 ? 'There was a server error' : error.message,
      stack: isProduction ? {} : error.stack,
    });
  }
};

// @desc  Update review
// @route PATCH /api/v1/reviews/:id
// @access Public
exports.updateReview = async (req, res) => {
  for (let key in req.body) {
    key = key.trim().toString();
  }

  try {
    const { id } = req.params;

    Object.keys(req.body).forEach(
      (key) =>
        req.body[key] == (null || undefined || '') && delete req.body[key]
    );

    if (Object.entries(req.body).length === 0) {
      return res.status(204).json({
        success: true,
        message: "Review doesn't exist, or has nothing to be updated with",
      });
    }

    const review = await Review.findOne({
      where: { review_id: id },
    });
    if (!review) {
      res.status(404);
      throw new Error(`Review with ID ${id} doesn't exist`);
    }
    const updatedReview = await review.update(req.body);

    // 204
    return res.status(200).json({
      success: true,
      data: updatedReview,
    });
  } catch (error) {
    if (!res.statusCode === 404) {
      res.status(500);
    }

    return res.status(res.statusCode || 500).json({
      success: false,
      message: res.status === 500 ? 'There was a server error' : error.message,
      stack: isProduction ? {} : error.stack,
    });
  }
};

// @desc  Delete review
// @route DELETE /api/v1/reviews/:id
// @access Public
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findOne({
      where: { review_id: id },
    });
    if (!review) {
      res.status(404);
      throw new Error(`Review with ID ${id} doesn't exist`);
    }
    await review.destroy();

    return res.status(200).json({
      success: true,
      message: `Review with ID ${review.review_id} was successfully deleted`,
    });
  } catch (error) {
    if (!res.statusCode === 404) {
      res.status(500);
    }

    return res.status(res.statusCode || 500).json({
      success: false,
      message: res.status === 500 ? 'There was a server error' : error.message,
      stack: isProduction ? {} : error.stack,
    });
  }
};
