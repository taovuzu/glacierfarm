import express from 'express';
import Order from '../models/order.js';

const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  const order = new Order({
    user: req.body.user,
    storageUnit: req.body.storageUnit,
    status: req.body.status,
  });

  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
