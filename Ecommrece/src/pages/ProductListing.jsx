import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { productService, wishlistService, categoryService } from '../services/api';
import { Filter, ChevronDown, SlidersHorizontal, Search, Star, ShoppingBag, Heart, X, Layers } from 'lucide-react';

const ProductListing = () => {
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';
  
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const query = searchParams.get('search');
    if (query) setSearchTerm(query);
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          productService.getProducts(),
          categoryService.getCategories()
        ]);
        setProducts(prodRes.data.products || []);
        setCategories(catRes.data.categories || []);
      } catch (err) {
        console.error("Failed to fetch collection", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCategoryChange = (catName) => {
    if (catName === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catName);
    }
    setSearchParams(searchParams);
  };

  const handleAddToWishlist = async (productId) => {
    try {
      await wishlistService.addToWishlist(productId);
      alert("Item added to your curated wishlist.");
    } catch (err) {
      console.error(err);
      alert("Unable to add to wishlist. Please ensure you are logged in.");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-serif italic text-2xl">Discovering Collection...</div>;

  return (
    <div className="bg-luxury-gold-light min-h-screen pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-12 lg:mb-16 space-y-8 lg:space-y-0 text-center lg:text-left">
          <div>
            <h1 className="text-3xl sm:text-5xl font-serif text-luxury-navy mb-4 tracking-tight italic">Exclusive Collection</h1>
            <p className="text-slate-500 font-light tracking-widest uppercase text-[10px]">Curating Indian Excellence Since 2026</p>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-6 w-full lg:w-auto">
            <div className="relative flex-grow lg:flex-grow-0">
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-3 bg-white border border-luxury-gold/20 rounded-none text-xs w-full lg:w-64 focus:border-luxury-gold transition-all outline-none" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-luxury-gold" />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 btn-outline-premium py-3 px-4 sm:px-6"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Filters Sidebar - Desktop & Mobile Drawer */}
          <div className={`lg:col-span-1 space-y-10 lg:block fixed lg:relative inset-0 lg:inset-auto z-50 lg:z-0 bg-white lg:bg-transparent p-8 lg:p-0 transition-transform duration-500 transform ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="lg:hidden flex justify-between items-center mb-12">
              <h2 className="text-2xl font-serif italic text-luxury-navy">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="text-luxury-navy"><X className="w-6 h-6" /></button>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-luxury-gold/20 pb-4">
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-luxury-navy">Classifications</h3>
                {activeCategory !== 'All' && (
                  <button onClick={() => { handleCategoryChange('All'); setShowFilters(false); }} className="text-[8px] text-luxury-gold font-bold uppercase tracking-widest hover:underline flex items-center">
                    <X className="w-2 h-2 mr-1" /> Reset
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => { handleCategoryChange('All'); setShowFilters(false); }}
                  className={`w-full flex items-center justify-between text-left px-4 py-3 text-[10px] tracking-widest uppercase transition-all ${activeCategory === 'All' ? 'bg-luxury-navy text-white' : 'text-slate-500 hover:bg-luxury-gold-light'}`}
                >
                  All Masterpieces
                </button>
                {categories.map((cat) => (
                  <button 
                    key={cat._id}
                    onClick={() => { handleCategoryChange(cat.name); setShowFilters(false); }}
                    className={`w-full flex items-center justify-between text-left px-4 py-3 text-[10px] tracking-widest uppercase transition-all ${activeCategory === cat.name ? 'bg-luxury-navy text-white shadow-lg' : 'text-slate-500 hover:bg-luxury-gold-light'}`}
                  >
                    {cat.name}
                    {activeCategory === cat.name && <Layers className="w-3 h-3 text-luxury-gold" />}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-luxury-navy mb-6 border-b border-luxury-gold/20 pb-4">Price Range</h3>
              <div className="space-y-6 px-2">
                <input type="range" className="w-full accent-luxury-gold" min="0" max="50000" />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 tracking-widest">
                  <span>₹0</span>
                  <span>₹50,000+</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowFilters(false)}
              className="lg:hidden w-full btn-premium py-5 mt-12"
            >
              Apply Selection
            </button>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-16">
              {filteredProducts.map((product) => (
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
                      <button 
                        onClick={() => handleAddToWishlist(product._id)}
                        className="p-3 bg-white/80 backdrop-blur-md text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                      >
                        <Heart className="w-4 h-4" />
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
                      <span className="text-2xl font-bold text-luxury-navy">₹{product.price?.toLocaleString('en-IN')}</span>
                      <div className="flex items-center space-x-1 text-luxury-gold">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-[10px] font-bold text-slate-400">4.9</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-32 bg-white/50 backdrop-blur-sm border border-dashed border-luxury-gold/20 rounded-3xl">
                <Layers className="w-12 h-12 text-luxury-gold/20 mx-auto mb-6" />
                <p className="text-luxury-navy font-serif italic text-2xl mb-2">Collection Not Found</p>
                <p className="text-slate-400 text-[10px] tracking-widest uppercase">No masterpieces match your current selection.</p>
                <button onClick={() => handleCategoryChange('All')} className="mt-8 text-luxury-gold text-xs font-bold uppercase tracking-widest border-b border-luxury-gold pb-1">Reset All Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
