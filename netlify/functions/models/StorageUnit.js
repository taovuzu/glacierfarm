import mongoose from 'mongoose';

const storageUnitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  temperature: { type: Number, required: true },
  location: String,
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now },
});

if (mongoose.models.StorageUnit) {
  delete mongoose.models.StorageUnit;
}

const StorageUnit = mongoose.model('StorageUnit', storageUnitSchema);
export default StorageUnit;
