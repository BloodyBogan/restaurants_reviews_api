'use strict';

const Sequelize = require('sequelize');
const db = require('./Database.config');

// Models
const RestaurantModel = require('../models/Restaurant.model');
const ReviewModel = require('../models/Review.model');
const UserModel = require('../models/User.model');

const sequelize = new Sequelize(db.DATABASE, db.USER, db.PASSWORD, {
  host: db.HOST,
  port: db.PORT,
  dialect: db.dialect,
  operatorAliases: false,
  pool: {
    max: db.pool.max,
    min: db.pool.min,
    acquire: db.pool.acquire,
    idle: db.pool.idle,
  },
});

const Restaurant = RestaurantModel(sequelize, Sequelize);
const Review = ReviewModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);

Restaurant.hasMany(Review, {
  foreignKey: 'restaurant_id',
  as: 'reviews',
  onDelete: 'CASCADE',
});
Review.belongsTo(Restaurant, {
  foreignKey: 'restaurant_id',
  onDelete: 'CASCADE',
});

const force = process.env.NODE_ENV === 'development' ? true : false;
sequelize.sync({ force }).then(() => {
  console.log('👌 Database & tables created'.cyan.bold);
});

const databaseConnection = async (callback) => {
  try {
    await sequelize.authenticate();
    console.log(
      '✨ Database connection has been established successfully'.magenta.bold
    );
    callback();
  } catch (error) {
    console.error('⛔ Unable to connect to the database: '.red.bold, error);
    await sequelize.close();
    console.log('❌ Database connection has been closed'.red.bold);
  }
};

module.exports = {
  databaseConnection,
  Restaurant,
  Review,
  User,
};
