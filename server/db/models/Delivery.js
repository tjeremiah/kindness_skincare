const Sequelize = require('sequelize');
const db = require('../database');

const Delivery = db.define('delivery', {
  date: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultvalue: Sequelize.NOW,
  },

  status: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultvalue: 'pending',
  },

  address: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Delivery;