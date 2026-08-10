const Sequelize = require('sequelize');
const db = require('../database');

const Customer = db.define('customer', {
  firstname: Sequelize.String,
  lastname: Sequelize.String,
  username: Sequelize.String,
  address: Sequelize.String,

});

module.exports = Customer;