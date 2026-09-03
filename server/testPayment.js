const db = require('./db/database');
const Payment = require('./db/models/Payment');

async function testPayment() {
  try {
    console.log('Connecting to PostgreSQL...');

    await db.authenticate();

    console.log('✅ PostgreSQL connection successful!');

    await db.sync();

    console.log('✅ Payment table ready!');

    const payment = await Payment.create({
      amount: 29.00,
      method: 'credit card',
      status: 'completed',
    });

    console.log('✅ Payment created!');

    console.log(payment.toJSON());

    await db.close();

    console.log('✅ Database connection closed.');

  } catch (error) {
    console.error('❌ Something went wrong:');
    console.error(error);
  }
}

testPayment();