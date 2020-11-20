'use strict';

const userRoles = {
  guest: 1, // ...001
  user: 2, // ...010
  admin: 4, // ...100
};

const accessLevels = {
  guest: userRoles.guest | userRoles.user | userRoles.admin, // ...111
  user: userRoles.user | userRoles.admin, // ...110
  admin: userRoles.admin, // ...100
};

module.exports = {
  userRoles,
  accessLevels,
};
