'use strict';

const crypto = require('crypto');

const jwtSecret = crypto.randomBytes(255).toString('hex');

console.table({ jwtSecret });
