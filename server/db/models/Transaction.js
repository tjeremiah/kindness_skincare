const Sequelize = require('sequelize');
const db = require('../database');

const Transaction = db.define('transaction', {
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
    },
  },

  status: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'pending',
  },
});

module.exports = Transaction;