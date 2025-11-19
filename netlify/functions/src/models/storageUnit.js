import mongoose from 'mongoose';

const storageUnitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
});

const StorageUnit = mongoose.model('StorageUnit', storageUnitSchema);

export default StorageUnit;
