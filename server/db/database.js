const Sequelize = require('sequelize');

const db = new Sequelize('skincare_db', 'postgres', 'yourpassword', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});


module.exports = db;