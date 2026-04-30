import React from 'react';
import { Trash2, Plus, Minus, ArrowLeft, CreditCard, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  const shipping = cart.length > 0 ? 15 : 0;
  const total = cartTotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-luxury-gold-light min-h-[80vh]">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-serif text-luxury-navy">Boutique Bag</h1>
        <span className="text-xs tracking-widest uppercase font-bold text-slate-400">{cart.length} ITEMS</span>
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-8">
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 p-8 bg-white border border-luxury-gold/10 shadow-sm group">
                <div className="h-32 w-32 flex-shrink-0 overflow-hidden bg-slate-100">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="font-serif text-xl text-luxury-navy mb-2">{item.name}</h3>
                  <p className="text-luxury-gold font-bold tracking-widest text-sm mb-4">₹{item.price.toLocaleString('en-IN')}</p>
                  <div className="flex items-center justify-center sm:justify-start space-x-6">
                    <div className="flex items-center border border-slate-200">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-2 hover:bg-luxury-gold-light transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-4 font-bold text-luxury-navy">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-luxury-gold-light transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-serif text-2xl text-luxury-navy">${(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}

            <Link to="/products" className="inline-flex items-center text-luxury-navy font-bold tracking-widest uppercase text-xs border-b border-luxury-gold pb-2 hover:text-luxury-gold transition-all">
              <ArrowLeft className="w-4 h-4 mr-2" /> Continue Exploring
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-luxury-navy text-white p-10 sticky top-32 shadow-2xl">
              <h2 className="text-2xl font-serif mb-10 border-b border-white/10 pb-6 italic">Summary</h2>
              <div className="space-y-6 mb-10">
                <div className="flex justify-between text-slate-400 font-light">
                  <span>Subtotal</span>
                  <span className="text-white">${cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400 font-light">
                  <span>Luxury Shipping</span>
                  <span className="text-white">${shipping}</span>
                </div>
                <div className="border-t border-white/10 pt-6 flex justify-between text-2xl font-serif italic text-luxury-gold">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>
              <Link
                to="/checkout"
                className="w-full btn-premium bg-white text-luxury-navy hover:bg-luxury-gold hover:text-white flex items-center justify-center py-5"
              >
                <CreditCard className="w-4 h-4 mr-3" /> Proceed to Checkout
              </Link>
              <div className="mt-8 pt-8 border-t border-white/10 flex justify-center space-x-6 opacity-40">
                <img src="https://www.svgrepo.com/show/354512/visa.svg" className="h-4" alt="Visa" />
                <img src="https://www.svgrepo.com/show/354041/mastercard.svg" className="h-4" alt="Mastercard" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-32 bg-white border border-dashed border-luxury-gold/30">
          <ShoppingBag className="w-16 h-16 text-luxury-gold/30 mx-auto mb-6" />
          <h2 className="text-3xl font-serif text-luxury-navy mb-4 italic">Your bag is currently empty</h2>
          <p className="text-slate-400 font-light mb-10">Discover our latest arrivals and find something extraordinary.</p>
          <Link to="/products" className="btn-premium">
            Start Exploring
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
