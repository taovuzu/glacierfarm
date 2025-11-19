import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  storageUnit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StorageUnit',
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'delivered', 'cancelled'],
    default: 'pending',
  },
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
