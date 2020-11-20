'use strict';

const {
  accessLevels: { guest },
} = require('../config/Roles.config');

exports.allowOnly = (accessLevel) => {
  const checkUserRole = (req, res, next) => {
    if (accessLevel === guest) {
      return next();
    } else if (!req.user && accessLevel !== guest) {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden',
      });
    } else if (!(accessLevel & req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden',
      });
    }

    next();
  };

  return checkUserRole;
};
