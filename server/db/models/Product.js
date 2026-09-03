const Sequelize = require('sequelize');
const db = require('../database');

const Product = db.define('product', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.DECIMAL(10,2),
    allowNull: false,
    validate: {
      min: 0,
    }
  },
  stock: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  description: {
    type: Sequelize.TEXT,
  },
});

module.exports = Product;

