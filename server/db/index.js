const db = require('./database');

const Customer = require('./models/Customer');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Payment = require('./models/Payment');
const Delivery = require('./models/Delivery');
const Transaction = require('./models/Transaction');

// Customer relationships
Customer.hasMany(Order);
Order.belongsTo(Customer);

Customer.hasMany(Payment);
Payment.belongsTo(Customer);

Customer.hasMany(Delivery);
Delivery.belongsTo(Customer);

//Order relationships
Order.hasMany(Transaction);
Transaction.belongsTo(Order);

// Product relationships
Product.hasMany(Transaction);
Transaction.belongsTo(Product);

// Payment relationships
Payment.hasMany(Transaction);
Transaction.belongsTo(Payment);

module.exports = {
  db,
  Customer,
  Product,
  Order,
  Payment,
  Delivery,
  Transaction,
};