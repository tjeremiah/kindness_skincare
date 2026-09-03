const {
  db,
  Customer,
  Product,
  Order,
  Payment,
  Delivery,
  Transaction,
} = require('./db');

async function seed() {
  try {
    console.log('📡 Connecting to the database...');

    await db.authenticate();

    console.log('✅ PostgreSQL connection successful!');

    //warning:
    // This deletes the existing tables and recreated them.
    // Use this only for development.
    await db.sync({ force: true });

    console.log('🌱 Database tables created!');
    console.log('🌱 Seeding the database...');

    // ---------------------------------------------------------
    // 1. CREATE CUSTOMERS
    //----------------------------------------------------------

    const customers = await Customer.bulkCreate([
      {
        firstname: 'Torrel',
        lastname: 'Jeremiah',
        username: 'torrel123',
        address: 'Brooklyn, NY',
        email: 'torrel@example.com', 
      }, 
      {
        firstname: 'Corzette',
        lastname: 'Beekman',
        username: 'corzette123',
        address: 'University Park, PA',
        email: 'corzette@example.com',
      },
    ],
    { returning: true},
   );

   console.log('✅ Customers created!');



   // ----------------------------------------------------------
   // 2. CREATE PRODUCTS
   // ----------------------------------------------------------

   const products = await Product.bulkCreate(
    [
      {
        name: 'Cleansing Conditioner',
        price: 29.00,
        stock: 20,
        description: 'Seasonal cleansing conditioner',
      },
      {
        name: 'Hand Lotion',
        price: 29.00,
        stock: 25,
        description: 'Seasonal Cleansing Lotion'
      },
    ],
    { returning: true }
   );

   console.log('✅ Products created!');


   //----------------------------------------------------------
   // 3. CREATE ORDERS
   // ---------------------------------------------------------

   const orders = await Order.bulkCreate(
    [
      {
        customerId: customers[0].id,
        date: new Date('2022-04-27'),
        status: 'pending',
      },
      {
        customerId: customers[1].id,
        date: new Date('2022-04-27'),
        status: 'pending',
      },
    ],
    { returning: true }
   );

   console.log('✅ Orders created!');


   //----------------------------------------------------------
   // 4. CREATE PAYMENTS
   // ---------------------------------------------------------

   const payments = await Payment.bulkCreate(
    [
      {
        customerId: customers[0].id,
        amount: 29.00,
        method: 'credit card',
        date: new Date('2022-04-27'),
      },
      {
        customerId: customers[1].id,
        amount: 29.00,
        method: 'credit card',
        date: new Date('2022-04-27'),
      },
    ],
    { returning: true}
   );

   console.log('✅ Payments created!');


   // -------------------------------------------------------
   // 5. CREATE DELIVERIES
   // --------------------------------------------------------

   const deliveries = await Delivery.bulkCreate(
    [
      {
        customerId: customers[0].id,
        date: new Date('2022-04-27'),
        status: 'pending',
        address: customers[0].address,
      },
      {
        customerId: customers[1].id,
        date: new Date('2022-04-27'),
        status: 'pending,',
        address: customers[1].address,
      },
    ],
    { returning: true }
   );

   console.log('✅ Deliveries created!');

   // ---------------------------------------------------------
   // 6. CREATE TRANSACTIONS
   // ---------------------------------------------------------

   const transactions = await Transaction.bulkCreate(
    [
       
      {
        orderId: orders[1].id,
        productId: products[1].id,
        paymentId: payments[1].id,
        quantity: 1,
        status: 'completed',
      },
    ],
    { returning: true }
   );

   console.log('✅ Transactions created!');


   // ----------------------------------------------------------
   // COMPLETE
   // ----------------------------------------------------------

   console.log('\n🌲 Database successfully seeded!');

   console.log(`Customers:     ${customers.length}`);
   console.log(`Products:      ${products.length}`);
   console.log(`Orders:        ${orders.length}`);
   console.log(`Payments:      ${payments.length}`);
   console.log(`Deliveries:    ${deliveries.length}`);
   console.log(`Transactions:  ${transactions.length}`);

   await db.close();

   console.log('✅ Database connection closed.');
   
  } catch (error) {
    console.error('🔥 Seeding failed!');
    console.error(error);

    await db.close();
  } 
}

seed();