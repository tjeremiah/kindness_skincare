const {
  db,
  Customer,
  Product,
  Order,
  Payment,
  Delivery,
  Transaction,
} = require('./db')

async function testAssociations() {
  try {
    console.log('Connecting to PostgreSQL...');

    await db.authenticate();

    console.log('✅ PostgreSQL connection successful!');
   
    //recreate tables for now. Not in prod
    await db.sync({ force: true });

    console.log('✅ All tables synchronized!');

    console.log('\n Models loaded: ');

    console.log('Customer:', Customer.name);
    console.log('Product:', Product.name);
    console.log('Order:', Order.name);
    console.log('Payment: ', Payment.name);
    console.log('Delivery:', Delivery.name)
    console.log('Transaction: ', Transaction.name);

    await db.close();

    console.log('\n✅ Database connection closed.');
  } catch (error) {
    console.error('❌ Something went wrong:');
    console.error(error);
  }
}

testAssociations();