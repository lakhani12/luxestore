import React, { useState, useEffect } from 'react';
import { User, Package, MapPin, CreditCard, ShoppingBag, ChevronRight, Clock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const { cart, cartTotal } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getOrderHistory();
        setOrders(response.data.order || []);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-luxury-gold-light">
      <div className="text-center p-12 bg-white border border-luxury-gold/20 shadow-2xl">
        <h2 className="text-3xl font-serif text-luxury-navy mb-4 italic">Private Boutique</h2>
        <p className="text-slate-500 mb-8 font-light uppercase tracking-widest text-[10px]">Please sign in to access your profile</p>
        <a href="/login" className="btn-premium">Sign In</a>
      </div>
    </div>
  );

  return (
    <div className="bg-luxury-gold-light min-h-screen pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white p-10 shadow-2xl border border-luxury-gold/10">
              <div className="flex flex-col items-center text-center mb-10">
                <div className="w-24 h-24 bg-luxury-navy flex items-center justify-center rounded-none mb-6 group overflow-hidden relative">
                  <User className="w-10 h-10 text-luxury-gold group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-luxury-gold/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h2 className="text-2xl font-serif text-luxury-navy mb-1 italic">{user.username}</h2>
                <p className="text-luxury-gold text-[10px] font-bold tracking-[0.3em] uppercase">{user.role} Member</p>
              </div>

              <nav className="space-y-4">
                {[
                  { id: 'orders', label: 'Order History', icon: Package },
                  { id: 'cart', label: 'Current Bag', icon: ShoppingBag },
                  { id: 'details', label: 'Account Details', icon: ShieldCheck },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center p-4 text-[10px] tracking-[0.2em] uppercase font-bold transition-all ${activeTab === tab.id ? 'bg-luxury-navy text-white' : 'text-slate-400 hover:text-luxury-gold hover:bg-slate-50'}`}
                  >
                    <tab.icon className="w-4 h-4 mr-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="bg-white p-12 shadow-2xl border border-luxury-gold/10 min-h-[600px]">
              
              {activeTab === 'orders' && (
                <div className="animate-fade-in space-y-10">
                  <h3 className="text-2xl font-serif text-luxury-navy italic border-b border-luxury-gold/10 pb-6">Your Past Acquisitions</h3>
                  {loading ? (
                    <p className="text-slate-400 italic">Curating your history...</p>
                  ) : orders.length > 0 ? (
                    <div className="space-y-12">
                      {orders.map((order) => (
                        <div key={order._id} className="border-l-2 border-luxury-gold pl-8 space-y-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Order ID: #{order._id.slice(-8)}</p>
                              <div className="flex items-center text-luxury-navy">
                                <Clock className="w-3 h-3 mr-2 text-luxury-gold" />
                                <span className="text-xs font-bold uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <span className="bg-green-50 text-green-600 text-[8px] font-bold tracking-[0.3em] uppercase px-3 py-1 border border-green-100">Confirmed</span>
                          </div>
                          
                          <div className="space-y-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-slate-50 overflow-hidden">
                                  <img src={item.productId?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover grayscale" alt="" />
                                </div>
                                <div className="flex-grow">
                                  <p className="text-xs font-serif text-luxury-navy italic">{item.productId?.name || 'Luxury Item'}</p>
                                  <p className="text-[8px] tracking-widest text-slate-400 uppercase">Qty: {item.quantity}</p>
                                </div>
                                <span className="text-xs font-bold text-luxury-gold">${item.total?.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                            <span className="text-[10px] tracking-widest uppercase font-bold text-slate-400">Total Investment</span>
                            <span className="text-xl font-bold text-luxury-navy">${order.totalbill?.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-slate-50 border border-dashed border-luxury-gold/20">
                      <p className="text-slate-400 italic">No acquisitions found in your record.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'cart' && (
                <div className="animate-fade-in space-y-10">
                  <h3 className="text-2xl font-serif text-luxury-navy italic border-b border-luxury-gold/10 pb-6">Current Boutique Bag</h3>
                  {cart.length > 0 ? (
                    <div className="space-y-8">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center space-x-6 p-6 bg-slate-50/50">
                          <img src={item.image} className="w-16 h-16 object-cover grayscale" alt="" />
                          <div className="flex-grow">
                            <h4 className="font-serif text-luxury-navy italic">{item.name}</h4>
                            <p className="text-[8px] tracking-widest text-slate-400 uppercase">Quantity: {item.quantity}</p>
                          </div>
                          <span className="text-luxury-gold font-bold">${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="pt-10 flex justify-between items-center border-t border-luxury-gold/10">
                        <span className="text-xs tracking-widest uppercase font-bold text-slate-400">Total Selection</span>
                        <span className="text-2xl font-bold text-luxury-navy">${cartTotal.toLocaleString()}</span>
                      </div>
                      <a href="/cart" className="w-full btn-premium py-5 block text-center">Complete Acquisition</a>
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-slate-50 border border-dashed border-luxury-gold/20">
                      <p className="text-slate-400 italic">Your bag is currently empty.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'details' && (
                <div className="animate-fade-in space-y-10">
                  <h3 className="text-2xl font-serif text-luxury-navy italic border-b border-luxury-gold/10 pb-6">Member Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-2">
                      <label className="block text-[8px] font-bold tracking-[0.3em] text-slate-400 uppercase">Username</label>
                      <div className="p-4 bg-slate-50 border border-slate-100 text-luxury-navy font-bold text-xs uppercase tracking-widest">{user.username}</div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[8px] font-bold tracking-[0.3em] text-slate-400 uppercase">Email Address</label>
                      <div className="p-4 bg-slate-50 border border-slate-100 text-luxury-navy font-bold text-xs uppercase tracking-widest">{user.email}</div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[8px] font-bold tracking-[0.3em] text-slate-400 uppercase">Member Since</label>
                      <div className="p-4 bg-slate-50 border border-slate-100 text-luxury-navy font-bold text-xs uppercase tracking-widest">January 2026</div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[8px] font-bold tracking-[0.3em] text-slate-400 uppercase">Status</label>
                      <div className="p-4 bg-slate-50 border border-slate-100 text-luxury-gold font-bold text-xs uppercase tracking-widest">Verified Elite</div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
