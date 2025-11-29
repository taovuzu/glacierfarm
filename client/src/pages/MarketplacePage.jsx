import React, { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, Package, Tag, Filter, X } from 'lucide-react';

const MarketplacePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    fetchMarketplace();
  }, []);

  const fetchMarketplace = async () => {
    try {
      const data = await apiCall('/marketplace');
      if (data.products) setProducts(data.products);
    } catch (error) {
      console.error('Error fetching marketplace:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyClick = (product) => {
    setSelectedProduct(product);
    setOrderQuantity(1);
  };

  const handleConfirmOrder = async () => {
    if (!selectedProduct) return;
    
    setOrdering(true);
    try {
      await apiCall('/orders', {
        method: 'POST',
        body: JSON.stringify({
          productId: selectedProduct._id,
          quantity: orderQuantity,
          totalPrice: selectedProduct.price * orderQuantity
        })
      });
      
      alert('Order placed successfully!');
      setSelectedProduct(null);
      fetchMarketplace(); // Refresh to update stock
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order: ' + (error.message || 'Unknown error'));
    } finally {
      setOrdering(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="heading-xl">Marketplace</h1>
        <p className="text-slate-500 mt-1">Browse and buy fresh produce from other farmers.</p>
      </div>

      <div className="card mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for produce..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="card card-hover group flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-sky-100 text-sky-600 rounded-xl group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    <Package className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-bold uppercase">Seller</p>
                    <p className="text-sm font-medium text-slate-700">{product.userId?.farmName || 'Unknown Farm'}</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2">{product.name}</h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-grow">{product.description || 'No description provided.'}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">Price</p>
                    <p className="text-lg font-bold text-slate-900">₹{product.price}<span className="text-sm text-slate-400 font-normal">/unit</span></p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="text-xs text-slate-400 uppercase font-bold">Stock</p>
                    <p className="text-lg font-bold text-slate-900">{product.quantity}</p>
                  </div>
                  <button 
                    onClick={() => handleBuyClick(product)}
                    className="btn-primary px-4 py-2 text-sm"
                  >
                    Buy
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No products available in the marketplace right now.</p>
            </div>
          )}
        </div>
      )}

      {/* Buy Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setSelectedProduct(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">Place Order</h2>
                <button onClick={() => setSelectedProduct(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedProduct.name}</h3>
                  <p className="text-slate-500 text-sm">Sold by {selectedProduct.userId?.farmName}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Price per unit</span>
                    <span className="font-medium text-slate-900">₹{selectedProduct.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Available Stock</span>
                    <span className="font-medium text-slate-900">{selectedProduct.quantity}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Quantity to Buy</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max={selectedProduct.quantity}
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                    />
                    <input
                      type="number"
                      min="1"
                      max={selectedProduct.quantity}
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(Math.min(parseInt(e.target.value) || 1, selectedProduct.quantity))}
                      className="w-20 input-field text-center"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-500">Total Price</p>
                    <p className="text-2xl font-bold text-sky-600">₹{(selectedProduct.price * orderQuantity).toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={handleConfirmOrder}
                    disabled={ordering}
                    className="btn-primary px-6 py-3"
                  >
                    {ordering ? 'Processing...' : 'Confirm Order'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MarketplacePage;
