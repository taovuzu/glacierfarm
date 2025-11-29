import React, { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Warehouse, 
  Thermometer, 
  MapPin, 
  Plus, 
  Search,
  AlertTriangle,
  CheckCircle,
  Snowflake,
  Battery,
  X
} from 'lucide-react';

const StorageUnitsPage = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [newUnit, setNewUnit] = useState({
    name: '',
    capacity: '',
    temperature: '',
    location: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const data = await apiCall('/storage-units');
      if (data.storageUnits) setUnits(data.storageUnits);
    } catch (error) {
      console.error('Error fetching units:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUnit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiCall('/storage-units', {
        method: 'POST',
        body: JSON.stringify(newUnit)
      });
      setIsModalOpen(false);
      setNewUnit({ name: '', capacity: '', temperature: '', location: '' });
      fetchUnits(); // Refresh list
    } catch (error) {
      console.error('Error adding unit:', error);
      alert('Failed to add storage unit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Storage Units</h1>
        <p className="mt-2 text-slate-600">Monitor your cold storage facilities</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {units.map((unit) => (
            <motion.div
              key={unit.id || unit._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card card-hover group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <Snowflake className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{unit.name || 'Storage Unit'}</h3>
                    <p className="text-xs text-slate-500">ID: {unit._id.slice(-6)}</p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${unit.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'} ring-4 ring-white shadow-sm`} />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Thermometer className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Temp</span>
                  </div>
                  <p className="text-xl font-bold text-slate-900">{unit.temperature}°C</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Battery className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Capacity</span>
                  </div>
                  <p className="text-xl font-bold text-slate-900">{unit.capacity}%</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-sm font-medium text-slate-500">Last synced: Just now</span>
                <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">View Details</button>
              </div>
            </motion.div>
          ))}

          {/* Register New Unit Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setIsModalOpen(true)}
            className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group min-h-[280px]"
          >
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
              <Plus className="w-8 h-8 text-slate-400 group-hover:text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-900">Buy Storage Unit</h3>
            <p className="text-sm text-slate-500 mt-2">Purchase a new cold storage unit for your farm</p>
          </motion.div>
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">Buy Storage Unit</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddUnit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Unit Model</label>
                  <select
                    required
                    className="input-field"
                    value={newUnit.name}
                    onChange={(e) => setNewUnit({...newUnit, name: e.target.value})}
                  >
                    <option value="">Select a model</option>
                    <option value="FrostGuard 3000">FrostGuard 3000 (Standard)</option>
                    <option value="CoolKeep Mini">CoolKeep Mini (Compact)</option>
                    <option value="ArcticVault Pro">ArcticVault Pro (Industrial)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    className="input-field"
                    value={newUnit.location}
                    onChange={(e) => setNewUnit({...newUnit, location: e.target.value})}
                    placeholder="e.g. Warehouse 1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Capacity (%)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      className="input-field"
                      value={newUnit.capacity}
                      onChange={(e) => setNewUnit({...newUnit, capacity: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Temperature (°C)</label>
                    <input
                      type="number"
                      required
                      step="0.1"
                      className="input-field"
                      value={newUnit.temperature}
                      onChange={(e) => setNewUnit({...newUnit, temperature: e.target.value})}
                      placeholder="0.0"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors">Cancel</button>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="px-4 py-2 bg-sky-500 text-white font-medium rounded-lg hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/20 disabled:opacity-50"
                  >
                    {submitting ? 'Processing...' : 'Buy Unit'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StorageUnitsPage;
