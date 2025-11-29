import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiCall } from '../utils/api';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  ShoppingBag,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Package,
  Clock,
  ChevronRight
} from 'lucide-react';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    storageUnits: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, unitsData] = await Promise.all([
          apiCall('/orders'),
          apiCall('/storage-units')
        ]);

        const pendingOrders = ordersData.orders.filter(o => o.status === 'pending').length;
        const totalRevenue = ordersData.orders.reduce((acc, curr) => acc + curr.totalPrice, 0);
        const activeUnits = unitsData.storageUnits.length;

        setStats({
          storageUnits: activeUnits,
          pendingOrders,
          totalRevenue
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="heading-xl">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back! Here's what's happening with your farm today.</p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <DashboardCard
          title="Active Storage Units"
          value={loading ? "..." : stats.storageUnits}
          icon={<Package className="text-white w-6 h-6" />}
          trend="+2.5%"
          trendUp={true}
          color="bg-gradient-to-br from-emerald-400 to-emerald-600"
          variants={itemVariants}
        />
        <DashboardCard
          title="Pending Orders"
          value={loading ? "..." : stats.pendingOrders}
          icon={<Clock className="text-white w-6 h-6" />}
          trend="-4.1%"
          trendUp={false}
          color="bg-gradient-to-br from-amber-400 to-orange-500"
          variants={itemVariants}
        />
        <DashboardCard
          title="Total Volume"
          value={loading ? "..." : `₹${stats.totalRevenue.toLocaleString()}`}
          icon={<TrendingUp className="text-white w-6 h-6" />}
          trend="+12.3%"
          trendUp={true}
          color="bg-gradient-to-br from-blue-400 to-indigo-600"
          variants={itemVariants}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
            <button className="text-emerald-600 text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">System initialized</p>
                  <p className="text-xs text-slate-500">2 hours ago</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="card bg-gradient-to-br from-slate-900 to-slate-800 text-white"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-left group">
              <Package className="w-6 h-6 mb-3 text-emerald-400 group-hover:scale-110 transition-transform" />
              <p className="font-medium">Add Product</p>
              <p className="text-xs text-slate-400 mt-1">Update inventory</p>
            </button>
            <button className="p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-left group">
              <ShoppingBag className="w-6 h-6 mb-3 text-blue-400 group-hover:scale-110 transition-transform" />
              <p className="font-medium">Create Order</p>
              <p className="text-xs text-slate-400 mt-1">New transaction</p>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, icon, trend, trendUp, color, variants }) => (
  <motion.div
    variants={variants}
    className="card group hover:shadow-lg transition-all duration-300"
  >
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${color} group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
        {trendUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
        {trend}
      </span>
      <span className="text-slate-400 text-xs">vs last month</span>
    </div>
  </motion.div>
);

export default DashboardPage;
