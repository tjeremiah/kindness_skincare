const db = require('./db/database');
const Transaction = require('./db/models/Transaction');

async function testTransaction() {
  try {
    console.log('Connecting to PostgreSQL...');

    await db.authenticate();

    console.log('✅ PostgreSQL connection successful!');

    await db.sync();

    console.log('✅ Transaction table ready!');

    const transaction = await Transaction.create({
      quantity: 1,
      status: 'completed',
    });

    console.log('✅ Transaction created!');

    console.log(transaction.toJSON());

    await db.close();

    console.log('✅ Database connection closed.');

  } catch (error) {
    console.error('❌ Something went wrong:');
    console.error(error);
  }
}

testTransaction();