import express from 'express';
import StorageUnit from '../models/storageUnit.js';

const router = express.Router();

// Get all storage units
router.get('/', async (req, res) => {
  try {
    const storageUnits = await StorageUnit.find();
    res.json(storageUnits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new storage unit
router.post('/', async (req, res) => {
  const storageUnit = new StorageUnit({
    name: req.body.name,
    capacity: req.body.capacity,
  });

  try {
    const newStorageUnit = await storageUnit.save();
    res.status(201).json(newStorageUnit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
