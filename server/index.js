const express = require('express');
const { db, Product, Customer, Order } = require('./db');

const app = express();

const PORT = 3001;

// Middleware
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Kindness Skincare API is running!');
});

// ====================
// PRODUCT ROUTES
// ====================

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
})

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

    // Name and description validation
    if (name.trim() === '' || description.trim() === '') {
      return res.status(400).json({
        error: 'Name and description cannot be empty'
      });
    }

    // Price validation
    if (typeof price !== 'number' || price <= 0) {
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

// ====================
// CUSTOMER ROUTES
// =====================

// Get all customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.findAll();

    res.json(customers); //send back to postman as JSON
  } catch (error) {
    console.error('❌ Error fetching customers:', error);

    res.status(500).json({
      error: 'Failed to fetch customer',
    });
  }
});

// Get one customer
app.get('/api/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).json({
        error: 'Customer not found',
      });
    }
    
    res.json(customer);
  } catch (error) {
    console.error('❌ Error fetching customer:', error);

    res.status(500).json({
      error: 'Failed to fetch customer',
    });
  }
});

// Post customer
app.post('/api/customers', async (req, res) => {
  try {
    const {firstname, lastname, username, address, email} = req.body;

    // Required fields
    if (!firstname || !lastname || !username || !address || !email) {
      return res.status(400).json({
        error: 'Firstname, lastname, username, address, and email are required',
      });
    }

    const customer = await Customer.create({
      firstname,
      lastname,
      username,
      address,
      email,
    });
    
    res.status(201).json(customer);
  } catch (error) {
    console.error('❌ Error creating customer:', error);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: error.message,
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        error: 'Username already exists',
      });
    }

    res.status(500).json({
      error: 'Failed to create customer',
    });
  }
});

// Put Customer
app.put('/api/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);

    // Check if customer exists
    if (!customer) {
      return res.status(404).json({
        error: 'Customer not found',
      });
    }

    // Get customer fields from request body
    const { firstname, lastname, username, address, email } = req.body;

    // Required fields
    if (!firstname || !lastname || !username || !address || !email ) {
      return res.status(400).json({
        error: 'Firstname, lastname, username, address, and email are required'
      });
    }

    // Update customer
    await customer.update({
      firstname,
      lastname,
      username,
      address,
      email,
    });

    res.json(customer); //send back to postman in json format
  } catch (error) {
    console.error('❌ Error updating customer:', error);

    if (error.name === 'SequelizeValidationError' ) {
      return res.status(400).json({
        error: error.message,
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
       return res.status(400).json({
        error: 'Username already exists',
       }); 
    }

    res.status(500).json({
      error: 'Failed to update customer',
    });

  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);

    // Check if customer exists
    if (!customer) {
      return res.status(404).json({
        error: 'Customer not found',
      });
    }

    // Delete customer
    await customer.destroy();

    res.json({
      message: 'Customer deleted successfully',
    });
  } catch (error) {
    console.error('❌ Error deleting customer:', error);

    res.status(500).json({
      error: 'Failed to delete customer',
    });

  }
});

// Get all orders for a customer
app.get('/api/customers/:id/orders', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id, {
      include: Order,
    });

    if (!customer) {
      return res.status(404).json({
        error: 'Customer not found',
      });
    }

    res.json(customer);
  } catch (error) {
    console.error('❌ Error fetching customer orders:', error);

    res.status(500).json({
      error: 'Failed to fetch customer orders',
    });
  }
});

// Get Customer for an order
app.get('/api/orders/:id/customer', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      attributes: ['id', 'date', 'status'],
      include:  {
        model: Customer,
        attributes: ['firstname', 'lastname', 'email'],
      }, 
    });

    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
      });
    }

    res.json(order);
  } catch (error) {
    console.error('❌ Error fetching order customer:', error);

    res.status(500).json({
      error: 'Failed to fetch order customer',
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
