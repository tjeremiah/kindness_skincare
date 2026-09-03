const Sequelize = require('sequelize');
const db = require('../database');

const Payment = db.define('payment', {
  amount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },

  method: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'credit card',
  },

  date: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
});

module.exports = Payment;