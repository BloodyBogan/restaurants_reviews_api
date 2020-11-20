'use strict';

module.exports = (sequelize, type) => {
  return sequelize.define('review', {
    review_id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    rating: {
      type: type.ENUM,
      values: ['1', '2', '3', '4', '5'],
      allowNull: false,
    },
    review: {
      type: type.TEXT,
      allowNull: false,
    },
    name: {
      type: type.STRING,
      allowNull: false,
    },
  });
};
