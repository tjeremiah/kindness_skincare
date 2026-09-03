const Sequelize = require('sequelize');
const db = require('../database');

const Order = db.define('order', {
  date: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },

  status: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'pending',
  },
});

module.exports = Order;