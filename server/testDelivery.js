const db = require('./db/database');
const Delivery = require('./db/models/Delivery');

async function testDelivery() {
  try {
    console.log('Connecting to PostgreSQL...');

    await db.authenticate();

    console.log('✅ PostgreSQL connection successful!');

    await db.sync();

    console.log('✅ Delivery table ready!');

    const delivery = await Delivery.create({
      date: new Date(),
      status: 'pending',
      address: 'Brooklyn, NY',
    });

    console.log('✅ Delivery created!');

    console.log(delivery.toJSON());

    await db.close()

    console.log('✅ Database connection closed.');
  
  } catch (error) {
    console.error('❌ Something went wrong:');
    console.error(error);
  }
}

testDelivery();