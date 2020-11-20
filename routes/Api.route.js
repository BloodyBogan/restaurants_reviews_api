'use strict';

const router = require('express').Router();
const passport = require('passport');
const { allowOnly } = require('../middleware/allowOnly.middleware');
const { accessLevels } = require('../config/Roles.config');
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
router
  .route('/restaurants')
  .get(allowOnly(accessLevels.guest), getRestaurants)
  .post(
    passport.authenticate('jwt', { session: false }),
    allowOnly(accessLevels.admin),
    addRestaurant
  );
router
  .route('/restaurants/:id')
  .get(allowOnly(accessLevels.guest), getRestaurant)
  .patch(
    passport.authenticate('jwt', { session: false }),
    allowOnly(accessLevels.admin),
    updateRestaurant
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    allowOnly(accessLevels.admin),
    deleteRestaurant
  );

//
//Reviews
//
router
  .route('/reviews')
  .get(allowOnly(accessLevels.guest), getReviews)
  .post(
    passport.authenticate('jwt', { session: false }),
    allowOnly(accessLevels.user),
    addReview
  );
router
  .route('/reviews/:id')
  .get(allowOnly(accessLevels.guest), getReview)
  .patch(
    passport.authenticate('jwt', { session: false }),
    allowOnly(accessLevels.user),
    updateReview
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    allowOnly(accessLevels.user),
    deleteReview
  );
router
  .route('/reviews/restaurant/:id')
  .get(allowOnly(accessLevels.guest), getReviewsForRestaurant);

module.exports = router;
