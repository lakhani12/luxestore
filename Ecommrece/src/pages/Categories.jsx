import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, Loader2, Search } from 'lucide-react';
import { categoryService } from '../services/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        setCategories(response.data.categories || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-gold-light flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-luxury-gold mb-4" />
        <p className="text-xs tracking-[0.3em] font-bold text-luxury-navy uppercase">Curating Classifications</p>
      </div>
    );
  }

  return (
    <div className="bg-luxury-gold-light min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-luxury-gold font-bold tracking-[0.4em] text-[10px] uppercase mb-4 block"
          >
            The Archive
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-7xl font-serif text-luxury-navy italic mb-6"
          >
            Curated Classifications
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 100 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="h-[1px] bg-luxury-gold mx-auto mb-8"
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto text-slate-500 font-light leading-relaxed"
          >
            Explore our collections organized by essence and occasion. Each classification represents a unique chapter in the story of modern luxury.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-md mx-auto mt-12 relative"
          >
            <input 
              type="text" 
              placeholder="Search Classifications..." 
              className="w-full pl-12 pr-6 py-5 bg-white border border-luxury-gold/20 rounded-none text-[10px] tracking-widest uppercase focus:border-luxury-gold transition-all outline-none shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gold" />
          </motion.div>
        </header>

        {categories.length === 0 ? (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-white/20">
            <Layers className="w-16 h-16 text-luxury-gold/20 mx-auto mb-6" />
            <h3 className="text-2xl font-serif italic text-luxury-navy mb-4">No classifications discovered yet</h3>
            <p className="text-slate-400 text-sm mb-8">Our curators are currently organizing the archives. Please return shortly.</p>
            <Link to="/products" className="btn-premium px-10 py-4 inline-block">Explore All Masterpieces</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((category, index) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative h-[600px] overflow-hidden rounded-none bg-luxury-navy"
              >
                <img 
                  src={category.image || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=1000'} 
                  alt={category.name}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-all duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy via-transparent to-transparent opacity-80"></div>
                
                <div className="absolute inset-0 p-12 flex flex-col justify-end text-white">
                  <span className="text-[10px] tracking-[0.3em] font-bold text-luxury-gold uppercase mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    Collection Archive
                  </span>
                  <h2 className="text-4xl font-serif italic mb-4 transform transition-all duration-500 group-hover:text-luxury-gold">
                    {category.name}
                  </h2>
                  <p className="text-sm font-light text-slate-300 leading-relaxed mb-8 line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    {category.description || 'Explore the refined details and exceptional craftsmanship of this exclusive classification.'}
                  </p>
                  <Link 
                    to={`/products?category=${category.name}`}
                    className="flex items-center text-xs font-bold tracking-[0.2em] uppercase text-white hover:text-luxury-gold transition-colors w-fit group/link"
                  >
                    View Collection 
                    <ArrowRight className="ml-2 w-4 h-4 transform group-hover/link:translate-x-2 transition-transform" />
                  </Link>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-8 right-8 w-12 h-12 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700">
                  <span className="text-[10px] font-serif italic">{index + 1}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Curator's Note */}
        <section className="mt-40 border-t border-luxury-gold/20 pt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="relative aspect-video overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000" 
                className="w-full h-full object-cover grayscale opacity-50"
                alt="Archive"
              />
              <div className="absolute inset-0 bg-luxury-navy/20"></div>
            </div>
            <div>
              <h3 className="text-3xl font-serif italic text-luxury-navy mb-6">The Curator's Mandate</h3>
              <p className="text-slate-600 font-light leading-relaxed mb-8 italic">
                "Our classifications are not merely categories; they are curated perspectives on beauty, utility, and heritage. We seek items that transcend the ordinary to find a place in your life's archive."
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-[1px] bg-luxury-gold"></div>
                <span className="text-[10px] tracking-widest uppercase font-bold text-luxury-navy">LuxeStore Editorial Board</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Categories;
