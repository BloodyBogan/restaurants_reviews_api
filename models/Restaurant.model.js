'use strict';

const assert = require('assert');

const { HOST, PORT } = process.env;

assert(HOST, 'HOST is required');
assert(PORT, 'PORT is required');

module.exports = (sequelize, type) => {
  return sequelize.define('restaurant', {
    restaurant_id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: type.STRING,
      unique: true,
      allowNull: false,
    },
    description: {
      type: type.STRING,
      allowNull: false,
    },
    location: {
      type: type.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: type.TEXT,
      allowNull: true,
      defaultValue: `${HOST}:${PORT}/assets/img/placeholder-restaurant.png`,
    },
  });
};
