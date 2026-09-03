const {
  db,
  Customer,
  Product,
  Order,
  Payment,
  Delivery,
  Transaction,
} = require('./db');

async function testRelationships() {
  try {
    console.log('📡 Connecting to PostgreSQL...')

    await db.authenticate();

    console.log('✅ PostgreSQL connection successful!\n');

    // Find the first customer
    const customer = await Customer.findOne({
      where: {
        username: 'torrel123',
      },
    });

    console.log('👤 Customer:');
    console.log(customer.toJSON());

    // Get this customer's orders
    const orders = await customer.getOrders();

    console.log('\n 📦 Customer Orders:');

    orders.forEach((order) => {
      console.log(order.toJSON());
    });

    // Get this customer's payments
    const payments = await customer.getPayments();

    console.log('\n💳 Customer Payments:');

    payments.forEach((payment) => {
      console.log(payment.toJSON())
    });

    // Get this customer deliveries
    const deliveries = await customer.getDeliveries();

    console.log('\n🚚 Customer Deliveries:');

    deliveries.forEach((delivery) => {
      console.log(delivery.toJSON());
    });

    // ----------------------------------------
    // ORDER
    // ----------------------------------------

    const order = orders[0];

    console.log('\n📦 Selected Order:');
    console.log(order.toJSON());

    // Order → Transactions
    const transactions = await order.getTransactions();

    console.log('\n🧾 Order Transactions:');
    console.log(transactions);

    // transactions.forEach((transaction) => {
    //   console.log(transaction.toJSON());
    // })

     // ----------------------------------------
    // TRANSACTION
    // ----------------------------------------

    const transaction = transactions[0];

    console.log('\n🧾 Selected Transaction:');
    console.log(transaction);

    //Transaction -> Product
    const product = await transaction.getProduct();

    console.log('\n🧴 Transaction Product:');
    console.log(product.toJSON());

    const payment = await transaction.getPayment();

    console.log('\n💳 Transaction Payment:');
    console.log(payment.toJSON());

  } catch (error) {
    console.error('❌ Something went wrong:');
    console.error(error);
  } finally {
    await db.close();
    console.log('\n🔌 Database connection closed.');
  }
}

testRelationships();