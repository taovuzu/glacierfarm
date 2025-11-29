import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import StorageUnit from './models/StorageUnit.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());

// Strip the function path if present (fix for Netlify 404s)
app.use((req, res, next) => {
  if (req.url.startsWith('/.netlify/functions/api')) {
    req.url = req.url.substring('/.netlify/functions/api'.length);
  }
  next();
});

// Database Connection
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Database connection failed');
  }
};

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

// Ensure DB connection for all routes
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(500).json({ error: 'Database connection error' });
  }
});

// ========== USER ROUTES ==========

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    return res.json({
      token,
      user: {
        id: user._id,
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
    console.log('Signup request body:', req.body);
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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);
    const username = email.split('@')[0];

    const newUser = new User({
      farmName,
      email,
      username,
      location,
      phone,
      passwordHash,
    });

    await newUser.save();

    const token = generateToken(newUser._id);

    return res.status(201).json({
      token,
      user: {
        id: newUser._id,
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
app.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      user: {
        id: user._id,
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

// Update user profile
app.put('/me', authenticateToken, async (req, res) => {
  try {
    const { farmName, location, phone } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (farmName) user.farmName = farmName;
    if (location) user.location = location;
    if (phone) user.phone = phone;

    await user.save();

    return res.json({
      user: {
        id: user._id,
        email: user.email,
        farmName: user.farmName,
        location: user.location,
        phone: user.phone,
      },
      message: 'Profile updated successfully'
    });
  } catch (err) {
    console.error('Update user error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Change password
app.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid current password' });
    }

    const passwordHash = await hashPassword(newPassword);
    user.passwordHash = passwordHash;
    await user.save();

    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ========== PRODUCTS ROUTES ==========

// Get all products for user
app.get('/products', authenticateToken, async (req, res) => {
  try {
    const userProducts = await Product.find({ userId: req.userId });
    return res.json({ products: userProducts });
  } catch (err) {
    console.error('Get products error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Create product
app.post('/products', authenticateToken, async (req, res) => {
  try {
    const { name, category, description, quantity, price } = req.body;

    if (!name || !category || !quantity || !price) {
      return res.status(400).json({ error: 'Name, category, quantity, and price required' });
    }

    const product = new Product({
      userId: req.userId,
      name,
      category,
      description,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      isListed: req.body.isListed || false,
    });

    await product.save();
    return res.status(201).json({ product });
  } catch (err) {
    console.error('Create product error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Update product
app.put('/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findOne({ _id: id, userId: req.userId });

    if (!product) {
      return res.status(404).json({ error: 'Product not found or unauthorized' });
    }

    if (updates.name) product.name = updates.name;
    if (updates.category) product.category = updates.category;
    if (updates.description) product.description = updates.description;
    if (updates.quantity) product.quantity = parseInt(updates.quantity);
    if (updates.price) product.price = parseFloat(updates.price);
    if (typeof updates.isListed !== 'undefined') product.isListed = updates.isListed;

    await product.save();
    return res.json({ product });
  } catch (err) {
    console.error('Update product error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ========== MARKETPLACE ROUTES ==========

// Get all products (marketplace)
app.get('/marketplace', authenticateToken, async (req, res) => {
  try {
    // Return all products except the user's own products, must be in stock and listed
    const products = await Product.find({
      userId: { $ne: req.userId },
      quantity: { $gt: 0 },
      isListed: true
    }).populate('userId', 'farmName location');
    return res.json({ products });
  } catch (err) {
    console.error('Get marketplace products error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ========== ORDERS ROUTES ==========

// Get all orders for user (both buying and selling)
app.get('/orders', authenticateToken, async (req, res) => {
  try {
    // Find orders where user is buyer OR seller
    // First find products owned by user to find sales
    const userProducts = await Product.find({ userId: req.userId });
    const productIds = userProducts.map(p => p._id);

    const orders = await Order.find({
      $or: [
        { userId: req.userId }, // Bought by user
        { productId: { $in: productIds } } // Sold by user
      ]
    }).populate('productId').populate('userId', 'farmName email');

    return res.json({ orders });
  } catch (err) {
    console.error('Get orders error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Create order
app.post('/orders', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity, totalPrice } = req.body;

    if (!productId || !quantity || !totalPrice) {
      return res.status(400).json({ error: 'Product ID, quantity, and total price required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Decrement stock
    product.quantity -= parseInt(quantity);
    await product.save();

    const order = new Order({
      userId: req.userId,
      productId,
      quantity: parseInt(quantity),
      totalPrice: parseFloat(totalPrice),
      totalPrice: parseFloat(totalPrice),
      status: 'pending' // Set to pending as requested
    });

    await order.save();
    return res.status(201).json({ order });
  } catch (err) {
    console.error('Create order error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ========== STORAGE UNITS ROUTES ==========

// Get all storage units for user
app.get('/storage-units', authenticateToken, async (req, res) => {
  try {
    const userUnits = await StorageUnit.find({ userId: req.userId });
    return res.json({ storageUnits: userUnits });
  } catch (err) {
    console.error('Get storage units error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Create storage unit
app.post('/storage-units', authenticateToken, async (req, res) => {
  try {
    const { name, capacity, temperature, location } = req.body;

    if (!name || !capacity || !temperature) {
      return res.status(400).json({ error: 'Name, capacity, and temperature required' });
    }

    const unit = new StorageUnit({
      userId: req.userId,
      name,
      capacity: parseInt(capacity),
      temperature: parseFloat(temperature),
      location,
    });

    await unit.save();
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

// Local Development Server
if (process.argv[1] && process.argv[1].endsWith('api.js')) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, async () => {
    console.log(`Server running locally on port ${PORT}`);
    try {
      await connectToDatabase();
    } catch (e) {
      console.log("DB Connection failed on startup");
    }
  });
}