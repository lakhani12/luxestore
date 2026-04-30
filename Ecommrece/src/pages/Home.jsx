import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShoppingBag, Zap, Heart, ShieldCheck, Truck, RotateCcw, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { productService, wishlistService } from '../services/api';

const Home = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [showEliteModal, setShowEliteModal] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getProducts();
        setProducts(response.data.products.slice(0, 4));
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const handleEliteSubmit = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => {
      setShowEliteModal(false);
      setSubscribed(false);
      setEmail('');
    }, 3000);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      await wishlistService.addToWishlist(productId);
      alert("Added to your curated wishlist.");
    } catch (err) {
      console.error(err);
      alert("Unable to add to wishlist. Please ensure you are logged in.");
    }
  };

  return (
    <div className="bg-luxury-gold-light min-h-screen">
      {/* Lavish Hero Section */}
      <section className="relative h-[95vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "linear" }}
            className="w-full h-full"
          >
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2070"
              alt="Luxury Fashion"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy/60 via-transparent to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="max-w-3xl text-white"
          >
            <span className="inline-block text-luxury-gold tracking-[0.3em] uppercase text-sm font-semibold mb-6 animate-fade-in">
              The Collection 2026
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif font-bold mb-8 leading-[1.1]">
              Defining <span className="italic">Excellence</span> In Style
            </h1>
            <p className="text-xl text-slate-200 mb-10 leading-relaxed font-light max-w-xl">
              Curated elegance for the modern connoisseur. Discover an exclusive range of premium goods designed to transcend trends.
            </p>
            
            <form onSubmit={handleSearchSubmit} className="max-w-md mb-12 relative group animate-fade-in">
              <input 
                type="text" 
                placeholder="Search The Archive..." 
                className="w-full pl-12 pr-6 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-none text-[10px] tracking-widest uppercase focus:bg-white focus:text-luxury-navy focus:border-luxury-gold transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gold" />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-gold hover:text-white transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/products" className="btn-premium">
                Explore Collection
              </Link>
              <Link to="/about" className="flex items-center text-white border-b border-white pb-1 hover:border-luxury-gold hover:text-luxury-gold transition-all tracking-widest text-xs font-bold uppercase">
                The Brand Story <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-[1px] h-20 bg-gradient-to-b from-white/20 to-luxury-gold animate-bounce"></div>
        </div>
      </section>

      {/* Trust Badges - Subtle & Elegant */}
      <section className="bg-white py-12 border-b border-luxury-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Truck, label: "Global Delivery" },
              { icon: ShieldCheck, label: "Secure Payment" },
              { icon: RotateCcw, label: "Authentic Returns" },
              { icon: Star, label: "Concierge Support" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center justify-center space-y-3 opacity-60 hover:opacity-100 transition-opacity">
                <item.icon className="w-6 h-6 text-luxury-navy" />
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-luxury-charcoal">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories - Asymmetric Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5">
            <span className="text-luxury-gold font-bold tracking-widest text-xs uppercase mb-4 block">Categories</span>
            <h2 className="text-3xl sm:text-5xl font-serif text-luxury-navy mb-8 leading-tight">
              Curated Selections for <span className="italic">Every Occasion</span>
            </h2>
            <p className="text-slate-600 leading-relaxed mb-10">
              From the heritage of Jaipur to the luxury of Mumbai, find the perfect ensemble that speaks of your journey and taste.
            </p>
            <Link to="/categories" className="btn-outline-premium">
              View All Categories
            </Link>
          </div>
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div whileHover={{ scale: 0.98 }} className="h-[300px] sm:h-[500px] rounded-none overflow-hidden relative group">
              <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Fashion" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-2xl font-serif italic">The Atelier</h3>
                <span className="text-[10px] tracking-widest uppercase">Fashion</span>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 0.98 }} className="h-[300px] sm:h-[400px] sm:mt-24 rounded-none overflow-hidden relative group">
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Accessories" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-2xl font-serif italic">Timeless Pieces</h3>
                <span className="text-[10px] tracking-widest uppercase">Accessories</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products - The Boutique Grid */}
      <section className="bg-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20">
            <div className="max-w-xl">
              <h2 className="text-5xl font-serif text-luxury-navy mb-6">The Boutique</h2>
              <p className="text-slate-600">Discover our most coveted pieces, hand-selected for their superior craftsmanship and timeless appeal.</p>
            </div>
            <div className="mt-8 md:mt-0">
              <Link to="/products" className="text-luxury-navy font-bold tracking-[0.2em] uppercase text-xs border-b-2 border-luxury-gold pb-2 hover:text-luxury-gold transition-colors">
                View All Arrivals
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {products.map((product) => (
              <motion.div 
                key={product._id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-luxury-gold-light">
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  </Link>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500"></div>
                  <button 
                    onClick={() => handleAddToWishlist(product._id)}
                    className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-md rounded-none text-luxury-charcoal hover:text-red-500 transition-colors shadow-sm"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-white/90 backdrop-blur-md">
                    <button 
                      onClick={() => addToCart(product._id, 1)}
                      className="w-full btn-premium py-3 flex items-center justify-center"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" /> Add To Cart
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-serif text-xl text-luxury-navy group-hover:text-luxury-gold transition-colors cursor-pointer">{product.name}</h3>
                  </Link>
                  <div className="flex justify-between items-center">
                    <span className="text-luxury-gold font-bold">₹{product.price?.toLocaleString('en-IN')}</span>
                    <div className="flex items-center text-[10px] text-slate-400 tracking-tighter">
                      <Star className="w-3 h-3 text-luxury-gold fill-luxury-gold mr-1" />
                      <span>4.9 RATING</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Banner */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative h-[400px] md:h-[600px] flex items-center justify-center overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=2070" 
            className="absolute inset-0 w-full h-full object-cover" 
            alt="Banner" 
          />
          <div className="absolute inset-0 bg-luxury-navy/40"></div>
          <div className="relative z-10 text-center text-white max-w-2xl px-6">
            <h2 className="text-3xl sm:text-5xl font-serif italic mb-6 md:mb-8 leading-tight">Elevating the Every Day</h2>
            <p className="text-base md:text-lg font-light leading-relaxed mb-8 md:mb-12 text-slate-100">
              Join our exclusive membership to receive early access to new collections, invitation-only events, and personal styling services.
            </p>
            <button 
              onClick={() => setShowEliteModal(true)}
              className="w-full sm:w-auto px-12 py-5 bg-white text-luxury-navy font-bold tracking-widest uppercase text-xs hover:bg-luxury-gold hover:text-white transition-all shadow-2xl"
            >
              Join The Elite Circle
            </button>
          </div>
        </div>
      </section>

      {/* Elite Circle Modal */}
      {showEliteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-luxury-navy/90 backdrop-blur-xl"
            onClick={() => setShowEliteModal(false)}
          ></motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white w-full max-w-xl p-12 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-luxury-gold"></div>
            <button 
              onClick={() => setShowEliteModal(false)}
              className="absolute top-8 right-8 text-luxury-navy hover:text-luxury-gold transition-colors"
            >
              <Zap className="w-6 h-6 rotate-45" />
            </button>
            
            {subscribed ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <ShieldCheck className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-4xl font-serif italic text-luxury-navy mb-4">Welcome to the Circle</h2>
                <p className="text-slate-500 font-light tracking-wide">Your application has been received. A personal stylist will contact you shortly.</p>
              </div>
            ) : (
              <>
                <span className="text-[10px] tracking-[0.4em] uppercase text-luxury-gold font-bold mb-4 block">Exclusive Membership</span>
                <h2 className="text-5xl font-serif text-luxury-navy italic mb-8">Elite Circle</h2>
                <p className="text-slate-600 font-light leading-relaxed mb-10">
                  Please provide your email address to begin your journey into our private world of luxury and curated style.
                </p>
                <form onSubmit={handleEliteSubmit} className="space-y-6">
                  <div>
                    <input 
                      required
                      type="email" 
                      placeholder="YOUR@EMAIL.COM" 
                      className="w-full border-b-2 border-slate-100 py-4 outline-none focus:border-luxury-gold transition-all text-sm tracking-widest uppercase font-bold"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="w-full btn-premium py-5">
                    Request Admission
                  </button>
                </form>
                <p className="mt-8 text-[9px] text-slate-400 uppercase tracking-widest text-center">
                  By requesting admission, you agree to our private terms of service.
                </p>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Home;
