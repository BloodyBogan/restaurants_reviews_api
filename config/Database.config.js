'use strict';

const assert = require('assert');

const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = process.env;

assert(MYSQL_HOST, 'MYSQL_HOST is required');
assert(MYSQL_PORT, 'MYSQL_PORT is required');
assert(MYSQL_USER, 'MYSQL_USER is required');
assert(MYSQL_PASSWORD, 'MYSQL_PASSWORD is required');
assert(MYSQL_DATABASE, 'MYSQL_DATABASE is required');

module.exports = {
  HOST: MYSQL_HOST,
  PORT: MYSQL_PORT,
  USER: MYSQL_USER,
  PASSWORD: MYSQL_PASSWORD,
  DATABASE: MYSQL_DATABASE,
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
