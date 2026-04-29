import React from 'react';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const wishlistItems = [
    { id: 3, name: "Smart Fitness Tracker", price: 99, category: "Electronics", image: "https://images.unsplash.com/photo-1575311373937-040b8e3fd5b6?auto=format&fit=crop&q=80&w=800" },
    { id: 4, name: "Canvas Travel Backpack", price: 85, category: "Bags", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Wishlist</h1>
          <p className="text-slate-600">You have {wishlistItems.length} items in your wishlist</p>
        </div>
        <Link to="/products" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors">
          Browse More
        </Link>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all group">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 shadow-sm hover:bg-red-50 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="text-sm text-indigo-600 font-semibold mb-1">{item.category}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 truncate">{item.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-slate-900">${item.price}</span>
                  <button className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                    <ShoppingBag className="w-4 h-4 mr-2" /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Your wishlist is empty</h2>
          <p className="text-slate-600 mb-8">Save items you love to find them easily later.</p>
          <Link to="/products" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors inline-block">
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
