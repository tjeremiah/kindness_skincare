const db = require('./db/database');
const Product = require('./db/models/Product');

async function testDelete() {
  try {
    await db.authenticate();

    console.log('✅ Connected to PostgreSQL');

    const product = await Product.findByPk(1);

    if (!product) {
      console.log('❌ Product not found');
      return;
    }

    console.log('Product being deleted:');
    console.log(product.toJSON());

    await product.destroy();

    console.log('✅ Product deleted successfully');

    await db.close();

  } catch (error) {
    console.error('❌ Something went wrong:');
    console.error(error);
  }
}

testDelete();