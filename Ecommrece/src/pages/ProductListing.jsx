import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown, SlidersHorizontal, Search, Star, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { productService } from '../services/api';

const ProductListing = () => {
  const { addToCart } = useCart();
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getProducts();
        setProducts(response.data.products);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-serif italic text-2xl">Discovering Collection...</div>;

  return (
    <div className="bg-luxury-gold-light min-h-screen pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 space-y-8 md:space-y-0">
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-serif text-luxury-navy mb-4 tracking-tight italic">Exclusive Collection</h1>
            <p className="text-slate-500 font-light tracking-widest uppercase text-[10px]">Curating Excellence Since 2026</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search Collection..." 
                className="pl-10 pr-4 py-3 bg-white border border-luxury-gold/20 rounded-none text-xs w-64 focus:border-luxury-gold transition-all outline-none" 
              />
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-luxury-gold" />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 btn-outline-premium py-3 px-6"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Filters Sidebar - Desktop */}
          <div className={`lg:col-span-1 space-y-10 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-luxury-navy mb-6 border-b border-luxury-gold/20 pb-4">Categories</h3>
              <div className="space-y-4">
                {['All', 'Exclusive', 'Watches', 'Accessories', 'Evening Wear'].map((cat) => (
                  <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 border-luxury-gold/30 rounded-none text-luxury-gold focus:ring-0" />
                    <span className="text-xs tracking-widest uppercase text-slate-500 group-hover:text-luxury-navy transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-luxury-navy mb-6 border-b border-luxury-gold/20 pb-4">Price Range</h3>
              <div className="space-y-6">
                <input type="range" className="w-full accent-luxury-gold" />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 tracking-widest">
                  <span>$0</span>
                  <span>$10,000+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-16">
              {products.map((product) => (
                <div key={product._id} className="group flex flex-col h-full bg-white border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
                  <div className="relative aspect-[3/4] overflow-hidden bg-luxury-gold-light">
                    <Link to={`/product/${product._id}`}>
                      <img
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    </Link>
                    <div className="absolute top-4 right-4">
                      <button className="p-3 bg-white/80 backdrop-blur-md text-slate-400 hover:text-red-500 transition-colors shadow-sm">
                        <SlidersHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-white/95">
                      <button 
                        onClick={() => addToCart(product._id, 1)}
                        className="w-full btn-premium py-3 flex items-center justify-center text-[10px] tracking-[0.3em]"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" /> Add To Bag
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col flex-grow">
                    <span className="text-luxury-gold text-[10px] tracking-[0.3em] font-bold uppercase mb-3">{product.category}</span>
                    <Link to={`/product/${product._id}`}>
                      <h3 className="text-xl font-serif text-luxury-navy mb-4 group-hover:text-luxury-gold transition-colors italic">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                      <span className="text-2xl font-bold text-luxury-navy">${product.price?.toLocaleString()}</span>
                      <div className="flex items-center space-x-1 text-luxury-gold">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-[10px] font-bold text-slate-400">4.9</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {products.length === 0 && (
              <div className="text-center py-20 bg-white border border-dashed border-luxury-gold/20">
                <p className="text-slate-400 font-serif italic text-xl">The collection is currently private.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
