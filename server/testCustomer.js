const db = require('./db/database');
const Customer = require('./db/models/Customer');

async function testCustomer() {
  try {
    console.log('Connecting to PostgreSQL...');

    await db.authenticate();

    console.log('✅ PostgreSQL connection successful!');

    await db.sync();

    console.log('✅ Customer table ready!');

    const existingCustomer = await Customer.findOne({
      where: {
        username: 'torrel123',
      },
    });

    if (existingCustomer) {
      console.log('✅ Customer already exists!');
      console.log(existingCustomer.toJSON());
    } else {
      const customer = await Customer.create({
        firstname: 'Torrel',
        lastname: 'Jeremiah',
        username: 'torrel123',
        address: 'Brooklyn, NY',
        email: 'torrel@example.com',
      })
     
      console.log('✅ Customer created!');
      console.log(customer.toJSON());
    }  

    await db.close();

    console.log('✅ Database connection closed.');

  } catch (error) {
    console.error('❌ Something went wrong:');
    console.error(error);
  }
}

testCustomer();