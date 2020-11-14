'use strict';

const router = require('express').Router();
const {
  getRestaurants,
  getRestaurant,
  addRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getReviews,
  getReviewsForRestaurant,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require('../controllers/Api.controller');

//
// Restaurants
//

// @route /api/v1/restaurants
// @access Public
router.route('/restaurants').get(getRestaurants).post(addRestaurant);
// @route /api/v1/restaurants/:id
// @access Public
router
  .route('/restaurants/:id')
  .get(getRestaurant)
  .patch(updateRestaurant)
  .delete(deleteRestaurant);

//
//Reviews
//

// @route /api/v1/reviews
// @access Public
router.route('/reviews').get(getReviews).post(addReview);
// @route /api/v1/reviews/:id
// @access Public
router
  .route('/reviews/:id')
  .get(getReview)
  .patch(updateReview)
  .delete(deleteReview);
// @route /api/v1/reviews/restaurant/:id
// @access Public
router.route('/reviews/restaurant/:id').get(getReviewsForRestaurant);

module.exports = router;
