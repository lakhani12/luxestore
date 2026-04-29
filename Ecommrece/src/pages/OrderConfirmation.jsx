import React from 'react';
import { CheckCircle2, ArrowRight, Package, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderConfirmation = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-luxury-gold-light px-4 py-20">
      <div className="max-w-2xl w-full bg-white p-12 shadow-2xl border border-luxury-gold/20 text-center">
        <CheckCircle2 className="w-20 h-20 text-luxury-gold mx-auto mb-8 animate-bounce" />
        <h1 className="text-4xl font-serif text-luxury-navy mb-4 italic">Thank You For Your Purchase</h1>
        <p className="text-slate-500 font-light mb-12">
          Your order <span className="font-bold text-luxury-navy">#LX-2026-8892</span> has been placed successfully. 
          A confirmation email with the invoice has been sent to your inbox.
        </p>

        <div className="bg-slate-50 p-8 border border-slate-100 text-left mb-12">
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-luxury-navy mb-6 border-b border-luxury-gold/20 pb-4">Order Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white p-2 mr-4 border border-slate-200">
                  <Package className="w-full h-full text-luxury-gold" />
                </div>
                <div>
                  <p className="text-sm font-bold text-luxury-navy">Luxe Essential Collection</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">Qty: 2</p>
                </div>
              </div>
              <span className="font-bold text-luxury-navy">$2,748.00</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center">
          <Link to="/" className="btn-premium">
            Back to Home
          </Link>
          <button className="btn-outline-premium flex items-center justify-center">
            <Download className="w-4 h-4 mr-2" /> Download Invoice
          </button>
        </div>

        <p className="mt-12 text-[10px] tracking-widest text-slate-400 uppercase">
          Estimated Delivery: 3-5 Boutique Days
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmation;
