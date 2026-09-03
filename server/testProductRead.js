const db = require('./db/database');
const Product = require('./db/models/Product');

async function testRead() {
  try {
    await db.authenticate();

    console.log('✅ Connected to PostgreSQL');

    const products = await Product.findAll();

    console.log('✅ Products found:');

    products.forEach(product => {
       console.log(product.toJSON());
    });
    await db.close();

  } catch (error) {
    console.error('❌ Something went wrong:');
    console.error(error);
  }
}

testRead();