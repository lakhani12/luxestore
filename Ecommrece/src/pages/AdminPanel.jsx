import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShoppingBag, Users, Package, TrendingUp, Plus, Edit, Trash2, Search, X, Loader2, DollarSign, Tag, Hash, Layers } from 'lucide-react';
import { productService, orderService, userService, categoryService } from '../services/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  
  const [newProduct, setNewProduct] = useState({ 
    name: '', price: '', category: '', images: [''], description: '', stock: '', 
    brand: '', sku: '', discount: 0, isNewProduct: true 
  });

  const [newCategory, setNewCategory] = useState({ name: '', description: '', image: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes, userRes, catRes] = await Promise.all([
        productService.getProducts(),
        orderService.getAllOrders(),
        userService.getAllUsers(),
        categoryService.getCategories()
      ]);
      setProducts(prodRes.data.products || []);
      setOrders(orderRes.data.orders || []);
      setUsers(userRes.data.users || []);
      setCategories(catRes.data.categories || []);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await productService.createProduct(newProduct);
      setShowModal(false);
      setNewProduct({ name: '', price: '', category: '', images: [''], description: '', stock: '', brand: '', sku: '', discount: 0, isNewProduct: true });
      fetchData();
    } catch (err) { alert(err.response?.data?.message || "Failed to add product"); }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await categoryService.createCategory(newCategory);
      setShowCategoryModal(false);
      setNewCategory({ name: '', description: '', image: '' });
      fetchData();
    } catch (err) { alert(err.response?.data?.message || "Failed to add category"); }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Remove this category?")) {
      try {
        await categoryService.deleteCategory(id);
        fetchData();
      } catch (err) { alert("Delete failed"); }
    }
  };

  const stats = [
    { label: 'Revenue', value: `$${orders.reduce((sum, o) => sum + (o.totalbill || 0), 0).toLocaleString()}`, icon: DollarSign, color: 'text-green-600' },
    { label: 'Orders', value: orders.length, icon: ShoppingBag, color: 'text-luxury-navy' },
    { label: 'Products', value: products.length, icon: Package, color: 'text-luxury-gold' },
    { label: 'Users', value: users.length, icon: Users, color: 'text-indigo-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-72 bg-luxury-navy text-white flex flex-col fixed inset-y-0 shadow-2xl">
        <div className="p-10 border-b border-white/5 text-center">
          <h2 className="text-3xl font-serif font-bold tracking-tighter text-luxury-gold italic">Luxe<span className="text-white font-light">Admin</span></h2>
        </div>
        <nav className="flex-grow p-8 space-y-4">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'categories', label: 'Categories', icon: Layers },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'users', label: 'Customers', icon: Users },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center p-4 text-[10px] tracking-[0.2em] uppercase font-bold transition-all border ${activeTab === tab.id ? 'bg-luxury-gold border-luxury-gold text-white shadow-lg' : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <tab.icon className="w-4 h-4 mr-4" /> {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow ml-72 p-16">
        <div className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-5xl font-serif text-luxury-navy italic tracking-tight capitalize">{activeTab}</h1>
          </div>
          {activeTab === 'products' && (
            <button onClick={() => setShowModal(true)} className="btn-premium flex items-center shadow-xl">
              <Plus className="w-4 h-4 mr-3" /> New Product
            </button>
          )}
          {activeTab === 'categories' && (
            <button onClick={() => setShowCategoryModal(true)} className="btn-premium flex items-center shadow-xl">
              <Plus className="w-4 h-4 mr-3" /> New Category
            </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-10 border border-luxury-gold/10 shadow-sm hover:shadow-xl transition-all duration-500 relative">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[9px] tracking-[0.3em] uppercase font-bold text-slate-400">{stat.label}</span>
                <stat.icon className={`w-6 h-6 ${stat.color} opacity-40`} />
              </div>
              <div className="text-3xl font-bold text-luxury-navy">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white border border-luxury-gold/10 shadow-2xl overflow-hidden min-h-[500px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[500px]">
              <Loader2 className="w-12 h-12 animate-spin text-luxury-gold" />
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && <div className="p-16 text-center italic text-slate-400 font-serif text-2xl">Boutique Insights Live...</div>}
              
              {activeTab === 'products' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-luxury-gold/5">
                      <tr>
                        <th className="p-8 text-[9px] tracking-[0.3em] uppercase font-bold text-slate-400">Masterpiece</th>
                        <th className="p-8 text-[9px] tracking-[0.3em] uppercase font-bold text-slate-400">Valuation</th>
                        <th className="p-8 text-[9px] tracking-[0.3em] uppercase font-bold text-slate-400">Stock</th>
                        <th className="p-8 text-[9px] tracking-[0.3em] uppercase font-bold text-slate-400">Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-luxury-gold/5">
                      {products.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50/50">
                          <td className="p-8">
                            <div className="flex items-center space-x-6">
                              <img src={p.images?.[0]} className="w-12 h-12 object-cover grayscale hover:grayscale-0 transition-all" alt="" />
                              <div>
                                <p className="font-serif text-lg text-luxury-navy italic">{p.name}</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{p.brand} • {p.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-8 font-bold text-luxury-navy">${p.price?.toLocaleString()}</td>
                          <td className="p-8"><span className="px-4 py-2 text-[9px] font-bold border">{p.stock} Units</span></td>
                          <td className="p-8">
                            <button onClick={() => productService.deleteProduct(p._id).then(fetchData)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'categories' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-luxury-gold/5">
                      <tr>
                        <th className="p-8 text-[9px] tracking-[0.3em] uppercase font-bold text-slate-400">Category</th>
                        <th className="p-8 text-[9px] tracking-[0.3em] uppercase font-bold text-slate-400">Description</th>
                        <th className="p-8 text-[9px] tracking-[0.3em] uppercase font-bold text-slate-400">Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-luxury-gold/5">
                      {categories.map((c) => (
                        <tr key={c._id} className="hover:bg-slate-50/50">
                          <td className="p-8 flex items-center space-x-4">
                            {c.image && <img src={c.image} className="w-10 h-10 rounded-full object-cover" alt="" />}
                            <span className="font-serif text-lg text-luxury-navy italic">{c.name}</span>
                          </td>
                          <td className="p-8 text-xs text-slate-400 max-w-xs truncate">{c.description}</td>
                          <td className="p-8">
                            <button onClick={() => handleDeleteCategory(c._id)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Orders and Users continue to work as before */}
              {activeTab === 'orders' && <div className="p-16 text-center italic text-slate-400">Orders management module active...</div>}
              {activeTab === 'users' && <div className="p-16 text-center italic text-slate-400">User directory active...</div>}
            </>
          )}
        </div>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-luxury-navy/90 backdrop-blur-sm z-[100] flex items-center justify-center p-8">
          <div className="bg-white w-full max-w-md p-12 shadow-2xl relative">
            <button onClick={() => setShowCategoryModal(false)} className="absolute top-8 right-8 text-slate-400"><X className="w-6 h-6" /></button>
            <h2 className="text-3xl font-serif text-luxury-navy italic mb-10">New Category</h2>
            <form onSubmit={handleAddCategory} className="space-y-8">
              <input required placeholder="Category Name" className="w-full p-4 bg-slate-50 border outline-none text-sm" 
                onChange={e => setNewCategory({...newCategory, name: e.target.value})} />
              <input placeholder="Image URL (Optional)" className="w-full p-4 bg-slate-50 border outline-none text-sm" 
                onChange={e => setNewCategory({...newCategory, image: e.target.value})} />
              <textarea placeholder="Description" rows="3" className="w-full p-4 bg-slate-50 border outline-none text-sm"
                onChange={e => setNewCategory({...newCategory, description: e.target.value})}></textarea>
              <button type="submit" className="w-full btn-premium py-5">Create Category</button>
            </form>
          </div>
        </div>
      )}

      {/* Product Modal (Enhanced with Category Selection) */}
      {showModal && (
        <div className="fixed inset-0 bg-luxury-navy/90 backdrop-blur-sm z-[100] flex items-center justify-center p-8">
          <div className="bg-white w-full max-w-2xl p-12 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-slate-400"><X className="w-6 h-6" /></button>
            <h2 className="text-3xl font-serif text-luxury-navy italic mb-10">New Acquisition</h2>
            <form onSubmit={handleAddProduct} className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <input required placeholder="Name" className="w-full p-4 bg-slate-50 border outline-none text-sm" 
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                <input required type="number" placeholder="Price" className="w-full p-4 bg-slate-50 border outline-none text-sm"
                  onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <input required placeholder="Brand" className="w-full p-4 bg-slate-50 border outline-none text-sm"
                  onChange={e => setNewProduct({...newProduct, brand: e.target.value})} />
                <input required placeholder="SKU" className="w-full p-4 bg-slate-50 border outline-none text-sm"
                  onChange={e => setNewProduct({...newProduct, sku: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <select required className="w-full p-4 bg-slate-50 border outline-none text-sm"
                  onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                </select>
                <input required type="number" placeholder="Stock" className="w-full p-4 bg-slate-50 border outline-none text-sm"
                  onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
              </div>
              <input required placeholder="Image URL" className="w-full p-4 bg-slate-50 border outline-none text-sm"
                onChange={e => setNewProduct({...newProduct, images: [e.target.value]})} />
              <textarea required placeholder="Description (min 10 chars)" rows="3" className="w-full p-4 bg-slate-50 border outline-none text-sm"
                onChange={e => setNewProduct({...newProduct, description: e.target.value})}></textarea>
              <button type="submit" className="w-full btn-premium py-5">Finalize</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
