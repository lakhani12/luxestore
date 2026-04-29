import { ShoppingCart, User, Search, Heart, Menu, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { cartCount } = useCart();
  const { user, isAdmin, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-luxury-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Menu Button - Left on mobile */}
          <button className="md:hidden p-2 text-luxury-navy">
            <Menu className="w-6 h-6" />
          </button>

          {/* Desktop Search - Left */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-luxury-navy/60 hover:text-luxury-gold transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/products" className="text-[10px] tracking-[0.3em] uppercase font-bold text-luxury-navy hover:text-luxury-gold transition-colors">
              Shop
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-[10px] tracking-[0.3em] uppercase font-bold text-luxury-gold hover:text-luxury-navy transition-colors flex items-center">
                <Shield className="w-3 h-3 mr-1" /> Admin
              </Link>
            )}
          </div>

          {/* Logo - Centered */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
            <Link to="/" className="text-4xl font-serif font-bold text-luxury-navy tracking-tighter">
              LUXE<span className="text-luxury-gold font-light">STORE</span>
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-8">
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
    </nav>
  );
};

export default Navbar;
