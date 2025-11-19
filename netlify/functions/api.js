import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Simple in-memory store for demo (replace with MongoDB in production)
const users = new Map();
const products = new Map();
const orders = new Map();
const storageUnits = new Map();

// Utility functions
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'secret-key', { expiresIn: '7d' });
};

const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// ========== USER ROUTES ==========

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = Array.from(users.values()).find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        farmName: user.farmName,
        location: user.location,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error during login' });
  }
});

// Signup endpoint
app.post('/signup', async (req, res) => {
  try {
    const { farmName, email, location, phone, password, confirmPassword } = req.body;

    // Validation
    if (!farmName || !email || !location || !phone || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = Array.from(users.values()).find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);
    const userId = `user_${Date.now()}`;

    const newUser = {
      id: userId,
      farmName,
      email,
      location,
      phone,
      passwordHash,
      createdAt: new Date(),
    };

    users.set(userId, newUser);

    const token = generateToken(userId);

    return res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        farmName: newUser.farmName,
        location: newUser.location,
        phone: newUser.phone,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Server error during signup' });
  }
});

// Get current user
app.get('/me', authenticateToken, (req, res) => {
  try {
    const user = users.get(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        farmName: user.farmName,
        location: user.location,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error('Get user error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ========== PRODUCTS ROUTES ==========

// Get all products for user
app.get('/products', authenticateToken, (req, res) => {
  try {
    const userProducts = Array.from(products.values()).filter(p => p.userId === req.userId);
    return res.json({ products: userProducts });
  } catch (err) {
    console.error('Get products error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Create product
app.post('/products', authenticateToken, (req, res) => {
  try {
    const { name, description, quantity, price } = req.body;

    if (!name || !quantity || !price) {
      return res.status(400).json({ error: 'Name, quantity, and price required' });
    }

    const productId = `product_${Date.now()}`;
    const product = {
      id: productId,
      userId: req.userId,
      name,
      description,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      createdAt: new Date(),
    };

    products.set(productId, product);
    return res.status(201).json({ product });
  } catch (err) {
    console.error('Create product error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ========== ORDERS ROUTES ==========

// Get all orders for user
app.get('/orders', authenticateToken, (req, res) => {
  try {
    const userOrders = Array.from(orders.values()).filter(o => o.userId === req.userId);
    return res.json({ orders: userOrders });
  } catch (err) {
    console.error('Get orders error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Create order
app.post('/orders', authenticateToken, (req, res) => {
  try {
    const { productId, quantity, totalPrice } = req.body;

    if (!productId || !quantity || !totalPrice) {
      return res.status(400).json({ error: 'Product ID, quantity, and total price required' });
    }

    const orderId = `order_${Date.now()}`;
    const order = {
      id: orderId,
      userId: req.userId,
      productId,
      quantity: parseInt(quantity),
      totalPrice: parseFloat(totalPrice),
      status: 'pending',
      createdAt: new Date(),
    };

    orders.set(orderId, order);
    return res.status(201).json({ order });
  } catch (err) {
    console.error('Create order error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ========== STORAGE UNITS ROUTES ==========

// Get all storage units for user
app.get('/storage-units', authenticateToken, (req, res) => {
  try {
    const userUnits = Array.from(storageUnits.values()).filter(s => s.userId === req.userId);
    return res.json({ storageUnits: userUnits });
  } catch (err) {
    console.error('Get storage units error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Create storage unit
app.post('/storage-units', authenticateToken, (req, res) => {
  try {
    const { name, capacity, temperature, location } = req.body;

    if (!name || !capacity || !temperature) {
      return res.status(400).json({ error: 'Name, capacity, and temperature required' });
    }

    const unitId = `unit_${Date.now()}`;
    const unit = {
      id: unitId,
      userId: req.userId,
      name,
      capacity: parseInt(capacity),
      temperature: parseFloat(temperature),
      location,
      status: 'active',
      createdAt: new Date(),
    };

    storageUnits.set(unitId, unit);
    return res.status(201).json({ storageUnit: unit });
  } catch (err) {
    console.error('Create storage unit error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ========== HEALTH CHECK ==========

app.get('/', (req, res) => {
  return res.json({
    message: 'GlacierFarm API is running',
    version: '1.0.0',
    endpoints: {
      auth: ['/login', '/signup', '/me'],
      products: ['GET /products', 'POST /products'],
      orders: ['GET /orders', 'POST /orders'],
      storageUnits: ['GET /storage-units', 'POST /storage-units'],
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  return res.status(500).json({ error: 'Internal server error' });
});

export const handler = serverless(app);
