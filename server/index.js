const express = require('express');
const { Op } = require('sequelize');
const { db, Product, Customer, Order, Transaction, Payment } = require('./db');

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

/* 
* Get /api/products/paginated?page=1&limit=10
* Return products one page at a time.
*/
app.get('/api/products/paginated', async (req, res) => {
  try {
     // 1. Read the page and limit from the URL.
     const page = Number(req.query.page ?? 1);
     const limit = Number(req.query.limit ?? 10);

     // 2. Validate the query parameters.
     if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 100
     ) {
      return res.status(400).json({
        error: 'Page must be positive, and limit must be between 1 and 100.'
      });
     }

     // 3. Calculate how many products to skip.
     const offset = (page - 1) * limit;

     // 4. Fetch the requested page and count all products.
     const result = await Product.findAndCountAll({
      limit,
      offset,
      order: [['id', 'ASC']],
     });

     // 5. Return the products and pagination information.
     res.json({
      page,
      limit,
      total: result.count,
      totalPages: Math.ceil(result.count / limit),
      products: result.rows,
     });
  } catch (error) {
    console.error('Error fetching pagination products:', error);
    
    res.status(500).json({
      error: 'Failed to fetch products',
    });
  }
});

/*
* GET /api/products/search?name=Lotion
* Optional filters: minPrice, maxPrice,
*/

app.get('/api/products/search', async (req, res) => {
  try {
    const { name, minPrice, maxPrice, inStock } = req.query;
    
    // Build the database filters.
    const where = {};

    // Search product names, ignoring letter case.
    if (name !== undefined) {
      if (name.trim() === '') {
        return res.status(400).json({
          error: 'Search name cannot be empty'
        });
      }

      where.name = {
        [Op.iLike]: `%${name.trim()}%`,
      };
    }

    // Filter by minimum price.
    if (minPrice !== undefined) {
      const minimum = Number(minPrice);

      if (!Number.isFinite(minimum) || minimum < 0) {
        return res.status(400).json({
          error: 'minPrice must be a non-negative number',
        });
      }

      where.price = {
        ...where.price,
        [Op.gte]: minimum,
      };
    }

    // Filter by maximum price.
    if (maxPrice !== undefined) {
      const maximum = Number(maxPrice);

      if (!Number.isFinite(maximum) || maximum < 0 ) {
        return res.status(400).json({
          error: 'maxPrice must be a non-negative number',
        });
      }

      where.price = {
        ...where.price,
        [Op.lte]: maximum,
      };
    }

    // Check that the price range is sensible.
    if (
      where.price?.[Op.gte] !== undefined &&
      where.price?.[Op.lte] !== undefined &&
      where.price[Op.gte] > where.price[Op.lte]
    ) {
      return res.status(400).json({
        error: 'minPrice cannot be greater than maxPrice',
      });
    }

    // Filter by product availability
    if (inStock !== undefined) {
      if (inStock !== 'true' && inStock !== 'false') {
        return res.status(400).json({
          error: 'inStock must be true or false',
        });
      }

      where.stock = inStock === 'true'
      ? { [Op.gt]: 0 }
      : 0;
    }

    // Query the database using the selected filters.
    const products = await Product.findAll({
      where,
      order: [['id', 'ASC']],
    });

    res.json(products);
  } catch (error) {
    console.error('Error searching products:', error);

    res.status(500).json({
      error: 'Failed to search products',
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

// Get completed transactions for one product
app.get('/api/products/:id/completed-transactions', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
      });
    }

    const transactions = await Transaction.findAll({
      where: {
        productId: product.id,
        status: 'completed',
      },
      attributes: ['id', 'quantity', 'status'],
      include: {
        model: Order,
        attributes: ['id', 'date', 'status'],
      },
      order: [['id', 'DESC']],
      limit: 5,
    });

    res.json(transactions);
  } catch (error) {
    console.error('❌ Error fetching completed transactions:', error);

    res.status(500).json({
      error: 'Failed to fetch completed transaction',
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

// Get one order with its transactions and products
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      attributes: ['id', 'date', 'status'],
      // When you find this order get its Customer and Transaction
      include: [
        {
          model: Customer,
          attributes: ['firstname', 'lastname', 'email'],
        },
        {
          model: Transaction,
          attributes: ['id', 'quantity', 'status'],
        
          // For each Transaction, also get its Product and Payment
          include: [
            {
              model: Product,
              attributes: ['name', 'price'],
           },
           {
              model: Payment,
              attributes: ['amount', 'method', 'date'],
           },   
         ],
        },
      ], 
    });  
    
    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
      });
    }

    res.json(order);
  } catch (error) {
    console.error('❌ Error fetching order:', error)

    res.status(500).json({
      error: 'Failed to fetch order',
    });
  }
});

// Get one product with its transactions and orders
app.get('/api/products/:id/transactions', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      attributes: ['id', 'name', 'price'],

      include: {
        model: Transaction,
        attributes: ['id', 'quantity', 'status'],
      
        include: {
          model: Order,
          attributes: ['id', 'date', 'status'],
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
      });
    }

    res.json(product);
  } catch (error) {
    console.error('❌ Error fetching product transactions:', error);

    res.status(500).json({
      error: 'Failed to fetch product transactions'
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
