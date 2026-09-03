const db = require('./db/database');
const Order = require('./db/models/Order');

async function testOrder() {
  try {
    console.log('connecting to PostgreSQL...');

    await db.authenticate();

    console.log('✅ PostgreSQL connection successful!');

    await db.sync();

    console.log('✅ Order table ready!');

    const order = await Order.create({
      status: 'pending',
    });

    console.log('✅ Order created!');

    console.log(order.toJSON());

    await db.close();

    console.log('✅ Database connection closed.');

  } catch (error) {
    console.error('❌ Something went wrong:');
    console.error(error);
  }
}

testOrder();  