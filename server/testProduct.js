const db = require('./db/database');
const Product = require('./db/models/Product');

async function testProduct() {
  try {
    console.log('Connecting to PostgreSQL...');

    await db.authenticate();
    
    console.log('✅ PostgreSQL connection successful!');

    await db.sync();

    console.log('✅ Product table created successfully!');

    await db.sync();

    console.log('✅ Product table ready!');

    // CREATE
    const product = await Product.create({
      name: 'Cleansing Conditioner',
      price: 29.00,
      stock: 15,
      description: 'Seasonal cleansing conditioner',
    });

    console.log('✅ Product created!');
    console.log(product.toJSON());

    //READ
    //const products = await Product.findAll();

    const product = await Product.findByPK(1);

    console.log('✅ Products found!');
    //console.log(products.map(product => product.toJSON()));
    console.log(product.toJSON())

    await db.close();

  } catch (error) {
    console.error('❌ Something went wrong:');
    console.error(error);
  }
}

testProduct();
