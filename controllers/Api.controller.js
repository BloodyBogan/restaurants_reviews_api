'use strict';

const Sequelize = require('sequelize');
const { Restaurant, Review } = require('../config/Sequelize.config');
const {
  postRestaurantSchema,
  patchRestaurantSchema,
  postReviewSchema,
  patchReviewSchema,
} = require('../config/Validation.config');

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

    res.status(200).json({
      success: true,
      data: restaurants,
      count: restaurants.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        res.statusCode === 500 ? 'There was a server error' : error.message,
      stack: isProduction ? {} : error.stack,
    });
  }
};

// @desc  Get single restaurant
// @route GET /api/v1/restaurants/:id
// @access Public
exports.getRestaurant = async (req, res) => {
  const { id } = req.params;

  try {
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

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    if (!(res.statusCode === 404)) {
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

// @desc  Add restaurant
// @route POST /api/v1/restaurants
// @access Public
exports.addRestaurant = async (req, res) => {
  try {
    const validationResult = await postRestaurantSchema.validateAsync(req.body);

    const restaurant = await Restaurant.create(validationResult);

    res.status(201).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    if (error.original && error.original.code === 'ER_DUP_ENTRY') {
      error.message = 'This reastaurant is already in the database';

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

// @desc  Update restaurant
// @route PATCH /api/v1/restaurants/:id
// @access Public
exports.updateRestaurant = async (req, res) => {
  const { id } = req.params;

  try {
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

    const validationResult = await patchRestaurantSchema.validateAsync(
      req.body
    );

    const updatedRestaurant = await restaurant.update(validationResult);

    // 204
    res.status(200).json({
      success: true,
      data: updatedRestaurant,
    });
  } catch (error) {
    if (error.details) {
      res.status(422);
    }

    if (!(res.statusCode === 404) || !(res.statusCode === 422)) {
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

// @desc  Delete restaurant
// @route DELETE /api/v1/restaurants/:id
// @access Public
exports.deleteRestaurant = async (req, res) => {
  const { id } = req.params;

  try {
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

    res.status(200).json({
      success: true,
      message: `Restaurant ${restaurant.name} and all of its reviews were successfully deleted`,
    });
  } catch (error) {
    if (!(res.statusCode === 404)) {
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

//
// Reviews
//

// @desc  Get all reviews
// @route GET /api/v1/reviews
// @access Public
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll();

    res.status(200).json({
      success: true,
      data: reviews,
      count: reviews.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        res.statusCode === 500 ? 'There was a server error' : error.message,
      stack: isProduction ? {} : error.stack,
    });
  }
};

// @desc  Get all reviews for a single restaurant
// @route GET /api/v1/reviews/restaurant/:id
// @access Public
exports.getReviewsForRestaurant = async (req, res) => {
  const { id } = req.params;

  try {
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

    res.status(200).json({
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
    if (!(res.statusCode === 404)) {
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

// @desc  Get single review
// @route GET /api/v1/reviews/:id
// @access Public
exports.getReview = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findOne({
      where: { review_id: id },
    });
    if (!review) {
      res.status(404);
      throw new Error(`Review with ID ${id} doesn't exist`);
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    if (!(res.statusCode === 404)) {
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

// @desc  Add review
// @route POST /api/v1/reviews
// @access Public
exports.addReview = async (req, res) => {
  const { restaurant_id } = req.body;

  try {
    const restaurant = await Restaurant.findOne({ where: { restaurant_id } });
    if (!restaurant) {
      res.status(404);
      throw new Error(`Restaurant with ID ${restaurant_id} doesn't exist`);
    }

    const validationResult = await postReviewSchema.validateAsync(req.body);

    const createdReview = await Review.create(validationResult);

    const reviewWithAssociations = await Review.findOne({
      where: { review_id: createdReview.review_id },
      include: {
        model: Restaurant,
        as: 'restaurant',
        attributes: ['name', 'description'],
      },
    });

    res.status(201).json({
      success: true,
      data: reviewWithAssociations,
    });
  } catch (error) {
    if (error.details) {
      res.status(422);
    }

    if (!(res.statusCode === 404) || !(res.statusCode === 422)) {
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

// @desc  Update review
// @route PATCH /api/v1/reviews/:id
// @access Public
exports.updateReview = async (req, res) => {
  const { id } = req.params;

  try {
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

    const validationResult = await patchReviewSchema.validateAsync(req.body);

    const updatedReview = await review.update(validationResult);

    // 204
    res.status(200).json({
      success: true,
      data: updatedReview,
    });
  } catch (error) {
    if (error.details) {
      res.status(422);
    }

    if (!(res.statusCode === 404) || !(res.statusCode === 422)) {
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

// @desc  Delete review
// @route DELETE /api/v1/reviews/:id
// @access Public
exports.deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findOne({
      where: { review_id: id },
    });
    if (!review) {
      res.status(404);
      throw new Error(`Review with ID ${id} doesn't exist`);
    }
    await review.destroy();

    res.status(200).json({
      success: true,
      message: `Review with ID ${review.review_id} was successfully deleted`,
    });
  } catch (error) {
    if (!(res.statusCode === 404)) {
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
