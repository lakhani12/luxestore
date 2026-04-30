import { ShoppingCart, User, Search, Heart, Menu, Shield, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { cartCount } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-luxury-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">
          {/* Menu Button - Left on mobile */}
          <button 
            className="md:hidden p-2 text-luxury-navy"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="hidden md:flex items-center space-x-6">
            <form onSubmit={handleSearch} className="relative group">
              <input 
                type="text" 
                placeholder="Search Archive..." 
                className="pl-8 pr-4 py-2 bg-slate-50 border border-transparent rounded-full text-[10px] w-40 focus:w-64 focus:bg-white focus:border-luxury-gold transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-luxury-navy/40 group-focus-within:text-luxury-gold transition-colors" />
            </form>
            <Link to="/products" className="text-[10px] tracking-[0.3em] uppercase font-bold text-luxury-navy hover:text-luxury-gold transition-colors">
              Shop
            </Link>
            <Link to="/contact" className="text-[10px] tracking-[0.3em] uppercase font-bold text-luxury-navy hover:text-luxury-gold transition-colors">
              Contact
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-[10px] tracking-[0.3em] uppercase font-bold text-luxury-gold hover:text-luxury-navy transition-colors flex items-center">
                <Shield className="w-3 h-3 mr-1" /> Admin
              </Link>
            )}
          </div>

          {/* Logo - Centered */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
            <Link to="/" className="text-2xl sm:text-4xl font-serif font-bold text-luxury-navy tracking-tighter whitespace-nowrap">
              LUXE<span className="text-luxury-gold font-light">STORE</span>
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-2 sm:space-x-8">
            <Link to="/wishlist" className="hidden sm:block p-2 text-luxury-navy hover:text-luxury-gold transition-colors relative">
              <Heart className="w-5 h-5" />
            </Link>
            <Link to="/cart" className="p-2 text-luxury-navy hover:text-luxury-gold transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-luxury-gold text-white text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <div className="hidden sm:block">
              {user ? (
                <div className="flex items-center space-x-6">
                  <Link to="/profile" className="flex items-center text-[10px] tracking-[0.3em] uppercase font-bold text-luxury-navy hover:text-luxury-gold transition-colors">
                    <User className="w-5 h-5 mr-2" />
                    {user.username}
                  </Link>
                  <button 
                    onClick={logout}
                    className="text-[8px] tracking-[0.2em] uppercase font-bold text-red-500 hover:text-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="flex items-center text-[10px] tracking-[0.3em] uppercase font-bold text-luxury-navy hover:text-luxury-gold transition-colors">
                  <User className="w-5 h-5 mr-2" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`md:hidden fixed inset-0 z-50 transition-transform duration-500 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute inset-0 bg-luxury-navy/90 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className="relative w-4/5 h-full bg-white shadow-2xl p-8 flex flex-col">
          <div className="flex justify-between items-center mb-12">
             <Link to="/" className="text-2xl font-serif font-bold text-luxury-navy" onClick={() => setIsMobileMenuOpen(false)}>
               LUXE<span className="text-luxury-gold font-light">STORE</span>
             </Link>
             <button onClick={() => setIsMobileMenuOpen(false)} className="text-luxury-navy">
               <X className="w-6 h-6" />
             </button>
          </div>

          <form onSubmit={(e) => { handleSearch(e); setIsMobileMenuOpen(false); }} className="relative mb-12">
            <input 
              type="text" 
              placeholder="Search Archives..." 
              className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 outline-none focus:border-luxury-gold text-xs uppercase tracking-widest"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gold" />
          </form>

          <div className="flex flex-col space-y-8">
            <Link to="/products" className="text-xs tracking-[0.4em] uppercase font-bold text-luxury-navy" onClick={() => setIsMobileMenuOpen(false)}>Shop Collection</Link>
            <Link to="/categories" className="text-xs tracking-[0.4em] uppercase font-bold text-luxury-navy" onClick={() => setIsMobileMenuOpen(false)}>Categories</Link>
            <Link to="/wishlist" className="text-xs tracking-[0.4em] uppercase font-bold text-luxury-navy" onClick={() => setIsMobileMenuOpen(false)}>Wishlist</Link>
            <Link to="/contact" className="text-xs tracking-[0.4em] uppercase font-bold text-luxury-navy" onClick={() => setIsMobileMenuOpen(false)}>Concierge</Link>
            {isAdmin && (
               <Link to="/admin" className="text-xs tracking-[0.4em] uppercase font-bold text-luxury-gold" onClick={() => setIsMobileMenuOpen(false)}>Admin Suite</Link>
            )}
          </div>

          <div className="mt-auto pt-8 border-t border-slate-100">
            {user ? (
              <div className="space-y-6">
                <Link to="/profile" className="flex items-center text-xs tracking-[0.2em] uppercase font-bold text-luxury-navy" onClick={() => setIsMobileMenuOpen(false)}>
                  <User className="w-5 h-5 mr-3 text-luxury-gold" /> {user.username}
                </Link>
                <button 
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="w-full py-4 border border-red-100 text-red-500 text-[10px] tracking-widest uppercase font-bold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-premium w-full flex justify-center py-5" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
