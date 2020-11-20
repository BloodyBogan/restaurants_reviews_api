'use strict';

const bcrypt = require('bcrypt');
const {
  userRoles: { user },
} = require('../config/Roles.config');

module.exports = (sequelize, type) => {
  const User = sequelize.define(
    'user',
    {
      user_id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      username: {
        type: type.STRING,
        allowNull: false,
      },
      email: {
        type: type.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: type.STRING,
        allowNull: false,
      },
      role: {
        type: type.INTEGER,
        defaultValue: user,
      },
    },
    {
      timestamps: false,
      hooks: {
        beforeValidate: hashPassword,
      },
    }
  );

  User.prototype.comparePasswords = async function (password) {
    try {
      const isMatch = await bcrypt.compare(password, this.password);
      return isMatch;
    } catch (error) {
      console.error(error);
    }
  };

  return User;
};

const hashPassword = async (user) => {
  try {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 13);
    }
  } catch (error) {
    console.error(error);
  }
};
