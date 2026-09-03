const db = require('./db/database');
const Product = require('./db/models/Product');

async function testUpdate() {
  try {
    await db.authenticate();
    
    console.log('✅ Connected to PostgreSQL');

    const product = await Product.findByPk(1);

    if (!product) {
      console.log('❌ Product not found');
      return;
    }

    console.log('Before update:');
    console.log(product.toJSON());

    product.stock = 15;

    await product.save();

    console.log('After update:');
    console.log(product.toJSON());

    await db.close();

  } catch (error) {
    console.error('❌ Something went wrong:');
    console.error(error);
  }
}

testUpdate();