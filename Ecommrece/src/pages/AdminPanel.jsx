import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Users, Package, TrendingUp, Plus, Edit, 
  Trash2, Search, X, Loader2, DollarSign, Tag, Hash, Layers, Menu,
  ChevronRight, ArrowUpRight, ArrowDownRight, CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import { productService, orderService, userService, categoryService } from '../services/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const showNotify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };
  
  // Modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [newProduct, setNewProduct] = useState({ 
    name: '', price: '', category: '', images: [''], description: '', stock: '', 
    brand: '', sku: '', discount: 0, isNewProduct: true 
  });

  const [newCategory, setNewCategory] = useState({ name: '', description: '', image: '' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userUpdateData, setUserUpdateData] = useState({ role: 'user', isActive: true });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes, userRes, catRes] = await Promise.all([
        productService.getProducts(),
        orderService.getAllOrders(),
        userService.getAllUsers(),
        categoryService.getCategories()
      ]);
      setProducts((prodRes.data.products || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setOrders((orderRes.data.orders || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setUsers(userRes.data.users || []);
      setCategories(catRes.data.categories || []);
    } catch (err) {
      console.error("Fetch failed", err);
      showNotify("Failed to synchronize with data vault", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtering logic
  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (activeTab === 'products') {
      return products.filter(p => p.name.toLowerCase().includes(term) || p.brand?.toLowerCase().includes(term) || p.sku?.toLowerCase().includes(term));
    }
    if (activeTab === 'orders') {
      return orders.filter(o => o._id.toLowerCase().includes(term) || o.userId?.username?.toLowerCase().includes(term));
    }
    if (activeTab === 'users') {
      return users.filter(u => u.username.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
    }
    if (activeTab === 'categories') {
      return categories.filter(c => c.name.toLowerCase().includes(term));
    }
    return [];
  }, [searchTerm, products, orders, users, categories, activeTab]);

  const handleAddOrEditProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await productService.updateProduct(editingItem._id, newProduct);
      } else {
        await productService.createProduct(newProduct);
      }
      showNotify(editingItem ? "Collection refined" : "Acquisition complete");
      setShowProductModal(false);
      setEditingItem(null);
      setNewProduct({ name: '', price: '', category: '', images: [''], description: '', stock: '', brand: '', sku: '', discount: 0, isNewProduct: true });
      fetchData();
    } catch (err) { showNotify(err.response?.data?.message || "Operation failed", "error"); }
  };

  const handleEditClick = (product) => {
    setEditingItem(product);
    setNewProduct({
      name: product.name,
      price: product.price,
      category: product.category,
      images: product.images,
      description: product.description,
      stock: product.stock,
      brand: product.brand,
      sku: product.sku,
      discount: product.discount,
      isNewProduct: product.isNewProduct
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Permanent removal of this masterpiece?")) {
      try {
        await productService.deleteProduct(id);
        showNotify("Masterpiece removed from archives");
        fetchData();
      } catch (err) { showNotify("Deletion failed", "error"); }
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await orderService.updateOrderStatus(id, status);
      showNotify("Transaction status updated");
      fetchData();
    } catch (err) { showNotify("Status update failed", "error"); }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await categoryService.createCategory(newCategory);
      showNotify("New classification established");
      setShowCategoryModal(false);
      setNewCategory({ name: '', description: '', image: '' });
      fetchData();
    } catch (err) { showNotify(err.response?.data?.message || "Category creation failed", "error"); }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Remove this classification from archives?")) {
      try {
        await categoryService.deleteCategory(id);
        showNotify("Classification removed");
        fetchData();
      } catch (err) { showNotify("Deletion failed", "error"); }
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Rescind membership for this individual?")) {
      try {
        await userService.deleteUser(id);
        showNotify("Membership rescinded");
        fetchData();
      } catch (err) { showNotify("Operation failed", "error"); }
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    console.log("Submitting User Update:", editingUser?._id, userUpdateData);
    try {
      await userService.updateUser(editingUser._id, userUpdateData);
      showNotify("Member archives updated successfully");
      setShowUserModal(false);
      fetchData();
    } catch (err) { 
      const msg = err.response?.data?.message || "Failed to update member status";
      showNotify(msg, "error"); 
    }
  };

  const handleEditUserClick = (user) => {
    setEditingUser(user);
    setUserUpdateData({ 
      role: user.role, 
      isActive: user.isActive !== false,
      username: user.username,
      email: user.email
    });
    setShowUserModal(true);
  };

  const stats = [
    { label: 'Total Revenue', value: `₹${orders.reduce((sum, o) => sum + (o.totalbill || 0), 0).toLocaleString('en-IN')}`, icon: DollarSign, color: 'text-green-600', trend: '+12.5%', isUp: true },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-luxury-navy', trend: '+3.2%', isUp: true },
    { label: 'Active Collection', value: products.length, icon: Package, color: 'text-luxury-gold', trend: '-1.4%', isUp: false },
    { label: 'Elite Members', value: users.length, icon: Users, color: 'text-indigo-600', trend: '+8.1%', isUp: true },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-50 text-green-700 border-green-200';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cancel': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Sidebar - Enhanced with better styling */}
      {/* Sidebar - Enhanced with better styling */}
      <div className={`w-72 bg-luxury-navy text-white flex flex-col fixed inset-y-0 shadow-2xl z-50 transition-transform duration-500 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-10 border-b border-white/5 flex items-center justify-between lg:justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-serif font-bold tracking-tighter italic">Luxe<span className="text-luxury-gold">Admin</span></h2>
            <p className="text-[8px] tracking-[0.4em] uppercase text-slate-400 mt-2">Management Suite</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white/50"><X className="w-6 h-6" /></button>
        </div>
        <nav className="flex-grow p-6 space-y-2 mt-4">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'categories', label: 'Categories', icon: Layers },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'users', label: 'Customers', icon: Users },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearchTerm(''); }}
              className={`w-full flex items-center px-6 py-4 text-[10px] tracking-[0.2em] uppercase font-bold transition-all rounded-lg ${activeTab === tab.id ? 'bg-luxury-gold text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <tab.icon className="w-4 h-4 mr-4" /> {tab.label}
              {activeTab === tab.id && <ChevronRight className="w-3 h-3 ml-auto" />}
            </button>
          ))}
        </nav>
        <div className="p-8 border-t border-white/5">
          <div className="bg-white/5 rounded-2xl p-6">
            <p className="text-[10px] font-bold text-luxury-gold tracking-widest uppercase mb-2">System Status</p>
            <div className="flex items-center text-[10px] text-green-400 font-bold">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              All Systems Operational
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow lg:ml-72 w-full">
        {/* Header Bar */}
        <header className="bg-white border-b border-slate-100 h-20 md:h-24 flex items-center justify-between px-6 lg:px-16 sticky top-0 z-40">
          <div className="flex items-center space-x-4 lg:hidden">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-luxury-navy"><Menu className="w-6 h-6" /></button>
            <h2 className="text-xl font-serif italic text-luxury-navy">LuxeAdmin</h2>
          </div>
          <div className="relative hidden sm:block w-64 lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`} 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent rounded-xl text-xs focus:bg-white focus:border-luxury-gold transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold text-luxury-navy">Director of Operations</span>
              <span className="text-[9px] text-slate-400 uppercase tracking-widest">Administrator</span>
            </div>
            <div className="w-12 h-12 bg-luxury-gold/10 rounded-full flex items-center justify-center border-2 border-luxury-gold/20">
              <Users className="w-5 h-5 text-luxury-gold" />
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 lg:mb-12 space-y-6 md:space-y-0">
            <div>
              <h1 className="text-4xl lg:text-5xl font-serif text-luxury-navy italic tracking-tight capitalize mb-2">{activeTab}</h1>
              <p className="text-[10px] text-slate-400 tracking-widest uppercase">System Control & Oversight</p>
            </div>
            <div className="flex space-x-4 w-full md:w-auto">
              {activeTab === 'products' && (
                <button onClick={() => { setEditingItem(null); setShowProductModal(true); }} className="btn-premium flex-grow md:flex-none flex items-center justify-center py-4">
                  <Plus className="w-4 h-4 mr-2" /> New Acquisition
                </button>
              )}
              {activeTab === 'categories' && (
                <button onClick={() => setShowCategoryModal(true)} className="btn-premium flex-grow md:flex-none flex items-center justify-center py-4">
                  <Plus className="w-4 h-4 mr-2" /> New Classification
                </button>
              )}
            </div>
          </div>

          {/* Dynamic Content Based on Tab */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-3xl shadow-sm">
              <Loader2 className="w-12 h-12 animate-spin text-luxury-gold mb-4" />
              <p className="text-xs tracking-[0.3em] font-bold text-slate-400 uppercase">Synchronizing Data Vault</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                      <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 group">
                        <div className="flex justify-between items-start mb-6">
                          <div className={`p-4 rounded-2xl ${stat.color.replace('text', 'bg')}/10 ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                          </div>
                          <div className={`flex items-center text-[10px] font-bold ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                            {stat.isUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                            {stat.trend}
                          </div>
                        </div>
                        <p className="text-[10px] tracking-[0.2em] font-bold text-slate-400 uppercase mb-2">{stat.label}</p>
                        <h3 className="text-3xl font-bold text-luxury-navy">{stat.value}</h3>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-serif italic text-luxury-navy">Recent Acquisitions</h3>
                        <button onClick={() => setActiveTab('products')} className="text-[10px] font-bold text-luxury-gold uppercase tracking-widest hover:underline">View All</button>
                      </div>
                      <div className="space-y-6">
                        {products.slice(0, 5).map((p) => (
                          <div key={p._id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all">
                            <div className="flex items-center space-x-4">
                              <img src={p.images?.[0]} className="w-12 h-12 rounded-xl object-cover" alt="" />
                              <div>
                                <p className="font-bold text-sm text-luxury-navy">{p.name}</p>
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{p.category}</p>
                              </div>
                            </div>
                            <span className="font-bold text-luxury-gold">₹{p.price?.toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-serif italic text-luxury-navy">Latest Transactions</h3>
                        <button onClick={() => setActiveTab('orders')} className="text-[10px] font-bold text-luxury-gold uppercase tracking-widest hover:underline">View All</button>
                      </div>
                      <div className="space-y-6">
                        {orders.slice(0, 5).map((o) => (
                          <div key={o._id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all">
                            <div className="flex items-center space-x-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getStatusStyle(o.status)} border`}>
                                <ShoppingBag className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-bold text-sm text-luxury-navy">{o.userId?.username || 'Guest Customer'}</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">ID: #{o._id.slice(-6)}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-luxury-navy">₹{o.totalbill?.toLocaleString('en-IN')}</p>
                              <span className="text-[8px] uppercase font-bold text-slate-400">Paid via Secure Link</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'products' && (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[1000px]">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                      <tr>
                        <th className="p-8 text-[9px] tracking-[0.3em] uppercase font-bold text-slate-400">Masterpiece</th>
                        <th className="p-8 text-[9px] tracking-[0.3em] uppercase font-bold text-slate-400">Category</th>
                        <th className="p-8 text-[9px] tracking-[0.3em] uppercase font-bold text-slate-400">Valuation</th>
                        <th className="p-8 text-[9px] tracking-[0.3em] uppercase font-bold text-slate-400">Stock</th>
                        <th className="p-8 text-[9px] tracking-[0.3em] uppercase font-bold text-slate-400 text-right">Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredData.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50/50 group transition-all">
                          <td className="p-8">
                            <div className="flex items-center space-x-6">
                              <div className="relative">
                                <img src={p.images?.[0]} className="w-16 h-16 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform duration-500" alt="" />
                                {p.isNewProduct && <span className="absolute -top-2 -right-2 bg-luxury-gold text-white text-[7px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter shadow-lg">New</span>}
                              </div>
                              <div>
                                <p className="font-serif text-lg text-luxury-navy italic leading-tight mb-1">{p.name}</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">SKU: {p.sku || 'N/A'} • {p.brand}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-8">
                            <span className="px-4 py-2 bg-slate-100 rounded-full text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                              {p.category}
                            </span>
                          </td>
                          <td className="p-8 font-bold text-luxury-navy text-lg">₹{p.price?.toLocaleString('en-IN')}</td>
                          <td className="p-8">
                            <div className="flex flex-col">
                              <span className={`text-xs font-bold ${p.stock < 5 ? 'text-red-500' : 'text-slate-600'}`}>{p.stock} Units</span>
                              <div className="w-20 h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                <div className={`h-full ${p.stock < 5 ? 'bg-red-500' : 'bg-luxury-gold'}`} style={{ width: `${Math.min(100, p.stock * 5)}%` }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="p-8 text-right">
                            <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                              <button onClick={() => handleEditClick(p)} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-luxury-gold hover:border-luxury-gold rounded-xl transition-all shadow-sm">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteProduct(p._id)} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 rounded-xl transition-all shadow-sm">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

              {activeTab === 'orders' && (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[900px]">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                      <tr>
                        <th className="p-8 text-[9px] tracking-[0.3em] uppercase font-bold text-slate-400">Order Ref</th>
                        <th className="p-8 text-[9px] tracking-[0.3em] uppercase font-bold text-slate-400">Customer</th>
                        <th className="p-8 text-[9px] tracking-[0.3em] uppercase font-bold text-slate-400">Status</th>
                        <th className="p-8 text-[9px] tracking-[0.3em] uppercase font-bold text-slate-400">Total</th>
                        <th className="p-8 text-[9px] tracking-[0.3em] uppercase font-bold text-slate-400 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredData.map((o) => (
                        <tr key={o._id} className="hover:bg-slate-50/50 group">
                          <td className="p-8">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-luxury-navy">#{o._id.slice(-8).toUpperCase()}</span>
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Processed: {new Date().toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="p-8">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                <Users className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-luxury-navy">{o.userId?.username || 'Guest'}</span>
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{o.userId?.email || 'No email'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-8">
                            <select 
                              value={o.status}
                              onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                              className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest border outline-none cursor-pointer transition-all ${getStatusStyle(o.status)}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="cancel">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-8 font-bold text-luxury-navy">₹{o.totalbill?.toLocaleString('en-IN')}</td>
                          <td className="p-8 text-right">
                            <button 
                              onClick={() => handleViewOrder(o)}
                              className="text-luxury-gold text-[9px] font-bold tracking-[0.2em] uppercase hover:underline"
                            >
                              View Dossier
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

              {activeTab === 'users' && (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[900px]">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                      <tr>
                        <th className="p-8 text-[9px] tracking-[0.3em] uppercase font-bold text-slate-400">Member</th>
                        <th className="p-8 text-[9px] tracking-[0.3em] uppercase font-bold text-slate-400">Role</th>
                        <th className="p-8 text-[9px] tracking-[0.3em] uppercase font-bold text-slate-400">Join Date</th>
                        <th className="p-8 text-[9px] tracking-[0.3em] uppercase font-bold text-slate-400 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredData.map((u) => (
                        <tr key={u._id} className="hover:bg-slate-50/50 group">
                          <td className="p-8">
                            <div className="flex items-center space-x-6">
                              <div className="w-12 h-12 bg-luxury-gold/10 text-luxury-gold rounded-2xl flex items-center justify-center font-bold">
                                {u.username?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-luxury-navy">{u.username}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-8">
                            <span className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border ${u.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-8 text-xs text-slate-500 italic">
                            {new Date(u.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="p-8 text-right">
                            <div className="flex justify-end items-center space-x-4">
                              <span className={`flex items-center text-[9px] font-bold uppercase tracking-widest mr-4 ${u.isActive ? 'text-green-500' : 'text-red-500'}`}>
                                {u.isActive ? <CheckCircle className="w-3 h-3 mr-2" /> : <X className="w-3 h-3 mr-2" />} 
                                {u.isActive ? 'Active' : 'Suspended'}
                              </span>
                              <button 
                                onClick={() => handleEditUserClick(u)}
                                className="p-3 text-slate-300 hover:text-luxury-gold transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(u._id)}
                                className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

              {activeTab === 'categories' && (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                      <tr>
                        <th className="p-8 text-[9px] tracking-[0.3em] uppercase font-bold text-slate-400">Classification</th>
                        <th className="p-8 text-[9px] tracking-[0.3em] uppercase font-bold text-slate-400">Insignia</th>
                        <th className="p-8 text-[9px] tracking-[0.3em] uppercase font-bold text-slate-400">Description</th>
                        <th className="p-8 text-[9px] tracking-[0.3em] uppercase font-bold text-slate-400 text-right">Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredData.map((c) => (
                        <tr key={c._id} className="hover:bg-slate-50/50 group">
                          <td className="p-8 font-serif text-xl text-luxury-navy italic">{c.name}</td>
                          <td className="p-8">
                            <div className="w-16 h-10 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                              {c.image ? <img src={c.image} className="w-full h-full object-cover" alt="" /> : <Layers className="w-full h-full p-2 text-slate-300" />}
                            </div>
                          </td>
                          <td className="p-8 text-xs text-slate-400 font-light max-w-xs">{c.description || 'No detailed briefing available.'}</td>
                          <td className="p-8 text-right">
                            <button onClick={() => handleDeleteCategory(c._id)} className="p-3 text-slate-300 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            </>
          )}
        </main>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-luxury-navy/90 backdrop-blur-sm z-[100] flex items-center justify-center p-8">
          <div className="bg-white w-full max-w-md p-12 rounded-[2.5rem] shadow-2xl relative">
            <button onClick={() => setShowCategoryModal(false)} className="absolute top-8 right-8 p-2 text-slate-400 hover:text-luxury-navy transition-colors"><X className="w-6 h-6" /></button>
            <h2 className="text-4xl font-serif text-luxury-navy italic mb-2">Classification</h2>
            <p className="text-[10px] tracking-[0.3em] font-bold text-slate-400 uppercase mb-10">New Archive Entry</p>
            <form onSubmit={handleAddCategory} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-1">Title</label>
                <input required placeholder="Category Name" className="w-full p-5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-luxury-gold transition-all text-sm" 
                  onChange={e => setNewCategory({...newCategory, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-1">Visual Asset URL</label>
                <input placeholder="Image URL (Optional)" className="w-full p-5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-luxury-gold transition-all text-sm" 
                  onChange={e => setNewCategory({...newCategory, image: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-1">Briefing</label>
                <textarea placeholder="Description" rows="3" className="w-full p-5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-luxury-gold transition-all text-sm resize-none"
                  onChange={e => setNewCategory({...newCategory, description: e.target.value})}></textarea>
              </div>
              <button type="submit" className="w-full btn-premium py-6 rounded-2xl shadow-xl mt-4">Confirm Entry</button>
            </form>
          </div>
        </div>
      )}

      {/* Product Modal (Unified Add/Edit) */}
      {showProductModal && (
        <div className="fixed inset-0 bg-luxury-navy/90 backdrop-blur-sm z-[100] flex items-center justify-center p-8">
          <div className="bg-white w-full max-w-3xl p-12 rounded-[3rem] shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setShowProductModal(false)} className="absolute top-10 right-10 p-2 text-slate-400 hover:text-luxury-navy transition-colors"><X className="w-6 h-6" /></button>
            <h2 className="text-5xl font-serif text-luxury-navy italic mb-2">{editingItem ? 'Refinement' : 'Acquisition'}</h2>
            <p className="text-[10px] tracking-[0.3em] font-bold text-slate-400 uppercase mb-12">{editingItem ? 'Optimizing Existing Masterpiece' : 'Archiving New Masterpiece'}</p>
            
            <form onSubmit={handleAddOrEditProduct} className="grid grid-cols-2 gap-x-10 gap-y-8">
              <div className="space-y-2 col-span-2 md:col-span-1">
                <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-1">Designation</label>
                <input required value={newProduct.name} placeholder="Product Name" className="w-full p-5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-luxury-gold transition-all text-sm" 
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-1">Valuation (₹)</label>
                <input required value={newProduct.price} type="number" placeholder="Price" className="w-full p-5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-luxury-gold transition-all text-sm"
                  onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
              </div>
              
              <div className="space-y-2 col-span-2 md:col-span-1">
                <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-1">House/Brand</label>
                <input required value={newProduct.brand} placeholder="Brand" className="w-full p-5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-luxury-gold transition-all text-sm"
                  onChange={e => setNewProduct({...newProduct, brand: e.target.value})} />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-1">Registry SKU</label>
                <input required value={newProduct.sku} placeholder="SKU" className="w-full p-5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-luxury-gold transition-all text-sm"
                  onChange={e => setNewProduct({...newProduct, sku: e.target.value})} />
              </div>

              <div className="space-y-2 col-span-2 md:col-span-1">
                <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-1">Classification</label>
                <select required value={newProduct.category} className="w-full p-5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-luxury-gold transition-all text-sm appearance-none cursor-pointer"
                  onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-1">Inventory Level</label>
                <input required value={newProduct.stock} type="number" placeholder="Units in Stock" className="w-full p-5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-luxury-gold transition-all text-sm"
                  onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-1">Visual Asset URL</label>
                <input required value={newProduct.images[0]} placeholder="Image URL" className="w-full p-5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-luxury-gold transition-all text-sm"
                  onChange={e => setNewProduct({...newProduct, images: [e.target.value]})} />
              </div>
              
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-1">Detailed Dossier (Briefing)</label>
                <textarea required value={newProduct.description} placeholder="Description (min 10 characters)" rows="4" className="w-full p-5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-luxury-gold transition-all text-sm resize-none"
                  onChange={e => setNewProduct({...newProduct, description: e.target.value})}></textarea>
              </div>

              <div className="col-span-2 mt-6">
                <button type="submit" className="w-full btn-premium py-6 rounded-[2rem] shadow-2xl flex items-center justify-center space-x-4">
                  {editingItem ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  <span>{editingItem ? 'Authorize Refinements' : 'Finalize Acquisition'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-luxury-navy/90 backdrop-blur-sm z-[100] flex items-center justify-center p-8">
          <div className="bg-white w-full max-w-4xl p-12 rounded-[3rem] shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setShowOrderModal(false)} className="absolute top-10 right-10 p-2 text-slate-400 hover:text-luxury-navy transition-colors"><X className="w-6 h-6" /></button>
            <div className="flex justify-between items-start mb-12">
              <div>
                <h2 className="text-5xl font-serif text-luxury-navy italic mb-2">Order Dossier</h2>
                <p className="text-[10px] tracking-[0.3em] font-bold text-slate-400 uppercase">Registry ID: #{selectedOrder._id}</p>
              </div>
              <div className={`px-6 py-3 rounded-2xl border text-xs font-bold uppercase tracking-widest ${getStatusStyle(selectedOrder.status)}`}>
                {selectedOrder.status}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-luxury-gold uppercase tracking-[0.2em]">Customer Information</p>
                <div className="bg-slate-50 p-6 rounded-2xl space-y-2">
                  <p className="font-bold text-luxury-navy">{selectedOrder.userId?.username || 'Guest'}</p>
                  <p className="text-xs text-slate-500">{selectedOrder.userId?.email || 'No email provided'}</p>
                </div>
              </div>
              <div className="space-y-4 col-span-2">
                <p className="text-[10px] font-bold text-luxury-gold uppercase tracking-[0.2em]">Order Summary</p>
                <div className="bg-slate-50 p-6 rounded-2xl">
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center pb-4 border-b border-slate-200 last:border-0 last:pb-0">
                        <div className="flex items-center space-x-4">
                          <img src={item.productId?.images?.[0]} className="w-12 h-12 rounded-lg object-cover" alt="" />
                          <div>
                            <p className="text-sm font-bold text-luxury-navy">{item.productId?.name || 'Unknown Product'}</p>
                            <p className="text-[10px] text-slate-400">Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                        <p className="font-bold text-luxury-navy">₹{(item.quantity * item.price).toLocaleString('en-IN')}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-300 flex justify-between items-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Valuation</p>
                    <p className="text-3xl font-serif italic text-luxury-navy">₹{selectedOrder.totalbill?.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setShowOrderModal(false)}
                className="px-8 py-4 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all"
              >
                Close Archive
              </button>
              <button 
                onClick={() => {
                  window.print();
                }}
                className="btn-premium py-4 px-8"
              >
                Print Manifest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Edit Modal */}
      {showUserModal && editingUser && (
        <div className="fixed inset-0 bg-luxury-navy/90 backdrop-blur-sm z-[100] flex items-center justify-center p-8">
          <div className="bg-white w-full max-w-md p-12 rounded-[2.5rem] shadow-2xl relative">
            <button onClick={() => setShowUserModal(false)} className="absolute top-8 right-8 p-2 text-slate-400 hover:text-luxury-navy transition-colors"><X className="w-6 h-6" /></button>
            <h2 className="text-4xl font-serif text-luxury-navy italic mb-2">Manage Member</h2>
            <p className="text-[10px] tracking-[0.3em] font-bold text-slate-400 uppercase mb-10">Elite Directory Refinement</p>
            
            <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
               <p className="font-bold text-luxury-navy mb-1">{editingUser.username}</p>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{editingUser.email}</p>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-1">Member Name</label>
                <input 
                  value={userUpdateData.username}
                  onChange={e => setUserUpdateData({...userUpdateData, username: e.target.value})}
                  className="w-full p-5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-luxury-gold transition-all text-sm"
                  placeholder="Username"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-1">Email Address</label>
                <input 
                  value={userUpdateData.email}
                  onChange={e => setUserUpdateData({...userUpdateData, email: e.target.value})}
                  className="w-full p-5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-luxury-gold transition-all text-sm"
                  placeholder="Email"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-1">Assigned Role</label>
                <select 
                  value={userUpdateData.role}
                  onChange={e => setUserUpdateData({...userUpdateData, role: e.target.value})}
                  className="w-full p-5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-luxury-gold transition-all text-sm appearance-none cursor-pointer"
                >
                  <option value="user">Standard Member</option>
                  <option value="manager">Boutique Manager</option>
                  <option value="admin">System Director</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-1">Access Status</label>
                <div className="flex items-center space-x-4 p-5 bg-slate-50 rounded-2xl">
                   <button 
                    type="button"
                    onClick={() => setUserUpdateData({...userUpdateData, isActive: !userUpdateData.isActive})}
                    className={`w-14 h-8 rounded-full transition-all relative ${userUpdateData.isActive ? 'bg-green-500' : 'bg-slate-300'}`}
                   >
                     <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${userUpdateData.isActive ? 'left-7' : 'left-1'}`}></div>
                   </button>
                   <span className="text-xs font-bold text-luxury-navy uppercase tracking-widest">
                     {userUpdateData.isActive ? 'Authorized' : 'Suspended'}
                   </span>
                </div>
              </div>

              <button type="submit" className="w-full btn-premium py-6 rounded-2xl shadow-xl mt-4">Update Archive</button>
            </form>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed bottom-10 right-10 z-[200] flex items-center p-6 rounded-2xl shadow-2xl border animate-in slide-in-from-right duration-300 ${notification.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5 mr-3" /> : <AlertCircle className="w-5 h-5 mr-3" />}
          <span className="text-[10px] font-bold tracking-widest uppercase">{notification.message}</span>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
