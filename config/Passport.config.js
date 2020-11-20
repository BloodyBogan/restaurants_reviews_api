'use strict';

const assert = require('assert');
const JWTStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;
const { User } = require('../config/Sequelize.config');

const { JWT_SECRET } = process.env;
assert(JWT_SECRET, 'JWT_SECRET is required');

module.exports = (passport) => {
  const options = {};

  options.secretOrKey = JWT_SECRET;
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  options.ignoreExpiration = false;

  passport.use(
    new JWTStrategy(options, async (JWTPayload, callback) => {
      try {
        const user = await User.findOne({ where: { email: JWTPayload.email } });
        if (!user) {
          callback(null, false);
          return;
        }

        callback(null, user);
      } catch (error) {
        callback(error, false);
      }
    })
  );
};
