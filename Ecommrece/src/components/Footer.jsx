import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-luxury-navy text-white pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          <div className="md:col-span-4">
            <Link to="/" className="text-3xl font-serif font-bold mb-8 block">
              LUXE<span className="text-luxury-gold font-light">STORE</span>
            </Link>
            <p className="text-slate-400 font-light leading-relaxed mb-8">
              Est. 2026. Dedicated to the pursuit of timeless beauty and exceptional craftsmanship. We believe in quality that endures.
            </p>
            <div className="flex space-x-6">
              <Instagram className="w-5 h-5 text-luxury-gold cursor-pointer hover:text-white transition-colors" />
              <Twitter className="w-5 h-5 text-luxury-gold cursor-pointer hover:text-white transition-colors" />
              <Facebook className="w-5 h-5 text-luxury-gold cursor-pointer hover:text-white transition-colors" />
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="text-luxury-gold text-xs font-bold tracking-[0.2em] uppercase mb-8">Concierge</h4>
            <ul className="space-y-4 text-sm font-light text-slate-300">
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-luxury-gold text-xs font-bold tracking-[0.2em] uppercase mb-8">The Brand</h4>
            <ul className="space-y-4 text-sm font-light text-slate-300">
              <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/sustainability" className="hover:text-white transition-colors">Sustainability</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-luxury-gold text-xs font-bold tracking-[0.2em] uppercase mb-8">The Newsletter</h4>
            <p className="text-sm font-light text-slate-300 mb-6">Receive private invitations and seasonal updates.</p>
            <div className="flex border-b border-luxury-gold/50 py-2">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="bg-transparent border-none w-full text-xs tracking-widest focus:ring-0 placeholder:text-slate-600"
              />
              <button className="text-luxury-gold text-xs font-bold tracking-widest hover:text-white transition-colors">
                JOIN
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-12 text-center">
          <p className="text-[10px] tracking-[0.3em] text-slate-500 uppercase">
            &copy; 2026 LUXESTORE INTERNATIONAL. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
