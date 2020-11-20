'use strict';

const router = require('express').Router();
const { allowOnly } = require('../middleware/allowOnly.middleware');
const { accessLevels } = require('../config/Roles.config');
const { postSignup, postLogin } = require('../controllers/Auth.controller');

router.route('/signup').post(allowOnly(accessLevels.guest), postSignup);
router.route('/login').post(allowOnly(accessLevels.guest), postLogin);

module.exports = router;
