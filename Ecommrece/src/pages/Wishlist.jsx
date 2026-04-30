import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Trash2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { wishlistService, cartService } from '../services/api';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const response = await wishlistService.getWishlist();
      setWishlistItems(response.data.items || []);
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (id) => {
    try {
      await wishlistService.removeFromWishlist(id);
      setWishlistItems(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await cartService.addToCart({ 
        item: { productId: product._id, quantity: 1 } 
      });
      // Optionally remove from wishlist after adding to cart
      // await handleRemove(product._id);
      alert(`${product.name} added to cart!`);
    } catch (err) {
      console.error("Failed to add to cart", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-luxury-gold mb-4" />
        <p className="text-xs tracking-[0.3em] font-bold text-slate-400 uppercase">Retrieving your treasures</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
        <div>
          <h1 className="text-5xl font-serif text-luxury-navy mb-3 italic">My Wishlist</h1>
          <p className="text-xs tracking-[0.2em] font-bold text-luxury-gold uppercase">Curated Selection • {wishlistItems.length} Masterpieces</p>
        </div>
        <Link to="/products" className="btn-premium">
          Continue Exploring
        </Link>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {wishlistItems.map((item) => (
            <div key={item._id} className="group relative bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <button 
                  onClick={() => handleRemove(item._id)}
                  className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-md rounded-full text-slate-400 shadow-xl hover:text-red-500 hover:bg-white transition-all transform hover:rotate-90"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8">
                <p className="text-[10px] text-luxury-gold font-bold uppercase tracking-[0.2em] mb-2">{item.category}</p>
                <h3 className="text-xl font-serif text-luxury-navy mb-4 italic truncate">{item.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-luxury-navy">${item.price?.toLocaleString()}</span>
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="p-3 bg-luxury-navy text-white rounded-2xl hover:bg-luxury-gold transition-colors shadow-lg"
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
            <Heart className="w-10 h-10 text-slate-200" />
          </div>
          <h2 className="text-3xl font-serif text-luxury-navy mb-4 italic">Your collection is empty</h2>
          <p className="text-slate-400 text-sm max-w-xs mx-auto mb-10 leading-relaxed">Save the pieces that inspire you and build your personal gallery of luxury.</p>
          <Link to="/products" className="btn-premium px-12">
            Discover Masterpieces
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
