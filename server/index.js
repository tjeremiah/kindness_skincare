const express = require('express');
const { db, Product } = require('./db');

const app = express();

const PORT = 3001;

// Middleware
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Kindness Skincare API is running!');
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.findAll();

    res.json(products);
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    
    res.status(500).json({
      error: 'Failed to fetch products',
    });  
  }
});

// GET one product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
      });
    }

    res.json(product);
  } catch (error) {
    console.error('❌ Error fetching product:', error);

    res.status(500).json({
      error: 'Failed to fetch product',
    });

  }
});

// POST product
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, stock, description } = req.body;
    
    // Required fields
    if (!name || price === undefined || stock === undefined || !description) {
      return res.status(400).json({
         error: 'Name, price, stock, and description are required', 
      });
    }

    // Name and description validation
    if (name.trim() === '' || description.trim() === '') {
      return res.status(400).json({
        error: 'Name and description cannot be empty',
      });
    }

    // Price validation
    if (typeof price !== 'number' || price <= 0 ) {
      return res.status(400).json({
        error: 'Price must be a positive number',
      });
    }

    // Stock validation
    if (!Number.isInteger(stock) || stock < 0 ) {
      return res.status(400).json({
        error: 'Stock must be a whole number that is 0 or greater',
      });
    }
    
    const product = await Product.create({
      name,
      price,
      stock,
      description,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('❌ Error creating product:', error);

    res.status(500).json({
      error: 'Failed to create product',
    });
  }
});

// PUT product
app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    // Check if product exists
    if (!product) {
        return res.status(404).json({
          error: 'Product not found',
        });
    }

    // Get product fields from request body
    const { name, price, stock, description} = req.body;

    // Required Fields
    if (!name || price === undefined || stock === undefined || !description) {
      return res.status(400).json({
        error: 'Name, price, stock, and description are required',
      });
    }
    // Update product
    await product.update({
      name,
      price,
      stock,
      description,
    });

    res.json(product);
  } catch (error) {
    console.error('❌ Error updating product:', error);

    res.status(500).json({
      error: 'Failed to update product',
    });
  }
});

// DELETE product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
      });
    }

    await product.destroy();

    res.json({
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('❌ Error deleting product:', error);

    res.status(500).json({
      error: 'Failed to delete product',
    });
  }
});

// Start server
const startServer = async () => {
  try {
    await db.authenticate();

    console.log('✅ Database connection successful!');
    
    app.listen(PORT, () => {
     console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

startServer();
