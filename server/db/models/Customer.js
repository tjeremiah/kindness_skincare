const Sequelize = require('sequelize');
const db = require('../database');

const Customer = db.define('customer', {
  firstname: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  lastname: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },

  address: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },  
});

module.exports = Customer;