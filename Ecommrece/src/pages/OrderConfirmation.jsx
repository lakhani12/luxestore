import { CheckCircle2, ArrowRight, Package, Download, Printer, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const { orderDetails } = location.state || {
    orderDetails: {
      total: 2748,
      items: [],
      formData: { firstName: 'Signature', lastName: 'Member', email: 'guest@example.com', address: '123 Luxury Lane, NY' },
      paymentMethod: 'card'
    }
  };

  const orderNumber = `LX-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-luxury-gold-light px-4 py-20 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white shadow-2xl border border-luxury-gold/20 overflow-hidden relative" id="invoice">
        {/* Invoice Header (Print Only) */}
        <div className="hidden print:block p-12 border-b-4 border-luxury-gold">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-serif text-luxury-navy mb-2 tracking-tighter italic">LuxeStore</h1>
              <p className="text-[10px] tracking-[0.3em] uppercase text-luxury-gold font-bold">The Archive of Excellence</p>
            </div>
            <div className="text-right text-[10px] tracking-widest uppercase text-slate-400 space-y-1">
              <p>Nariman Point, Mumbai</p>
              <p>Maharashtra, India 400021</p>
              <p>support@luxestore.in</p>
            </div>
          </div>
        </div>

        <div className="p-12 text-center print:text-left">
          <div className="print:hidden">
            <CheckCircle2 className="w-20 h-20 text-luxury-gold mx-auto mb-8 animate-bounce" />
            <h1 className="text-4xl font-serif text-luxury-navy mb-4 italic">Acquisition Confirmed</h1>
            <p className="text-slate-500 font-light mb-12">
              Your order <span className="font-bold text-luxury-navy">#{orderNumber}</span> has been successfully processed. 
              A digital certificate of authenticity has been dispatched to <span className="text-luxury-navy italic">{orderDetails.formData.email}</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left mb-16">
            <div>
              <h3 className="text-[10px] tracking-[0.3em] uppercase font-bold text-luxury-gold mb-4">Shipping Destination</h3>
              <div className="text-sm text-luxury-navy space-y-1">
                <p className="font-bold">{orderDetails.formData.firstName} {orderDetails.formData.lastName}</p>
                <p className="font-light">{orderDetails.formData.address}</p>
                <p className="font-light">{orderDetails.formData.city}, {orderDetails.formData.zip}</p>
              </div>
            </div>
            <div className="text-right md:text-left">
              <h3 className="text-[10px] tracking-[0.3em] uppercase font-bold text-luxury-gold mb-4">Transaction Details</h3>
              <div className="text-sm text-luxury-navy space-y-1">
                <p className="font-light underline underline-offset-4 decoration-luxury-gold/30">Order: #{orderNumber}</p>
                <p className="font-light italic">Date: {date}</p>
                <p className="font-light uppercase tracking-tighter">Payment: {orderDetails.paymentMethod}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50/50 p-10 border border-slate-100 mb-12">
            <h3 className="text-[10px] tracking-[0.3em] uppercase font-bold text-luxury-navy mb-8 border-b border-luxury-gold/20 pb-4 flex justify-between">
              <span>Selected Masterpieces</span>
              <span>Subtotal</span>
            </h3>
            <div className="space-y-6">
              {orderDetails.items.length > 0 ? orderDetails.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white flex items-center justify-center mr-4 border border-slate-200">
                      <Package className="w-5 h-5 text-luxury-gold/50" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-luxury-navy italic">Item Reference #{idx + 1}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-luxury-navy italic tracking-tighter">Verified</span>
                </div>
              )) : (
                <div className="flex justify-between items-center text-sm italic text-slate-400">
                  <span>Luxe Essential Collection (Signature Set)</span>
                  <span>₹2,45,000.00</span>
                </div>
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-luxury-gold/10 space-y-3">
              <div className="flex justify-between text-[10px] tracking-widest uppercase text-slate-400">
                <span>Value Added Tax (Inc)</span>
                <span>₹0.00</span>
              </div>
              <div className="flex justify-between text-[10px] tracking-widest uppercase text-slate-400">
                <span>White Glove Shipping</span>
                <span>₹1,500.00</span>
              </div>
              <div className="flex justify-between text-2xl font-serif italic text-luxury-navy pt-4">
                <span>Total Acquisition</span>
                <span className="text-luxury-gold font-bold not-italic">₹{orderDetails.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center print:hidden">
            <Link to="/" className="btn-premium px-10">
              Return to Gallery
            </Link>
            <button 
              onClick={handlePrint}
              className="btn-outline-premium flex items-center justify-center px-10"
            >
              <Printer className="w-4 h-4 mr-2" /> Print Invoice
            </button>
          </div>

          <div className="mt-16 flex items-center justify-center space-x-8 print:mt-12">
            <div className="flex items-center text-[8px] tracking-[0.2em] uppercase font-bold text-slate-300">
              <ShieldCheck className="w-3 h-3 mr-2" /> Insured Transaction
            </div>
            <div className="w-1 h-1 bg-luxury-gold rounded-full"></div>
            <div className="flex items-center text-[8px] tracking-[0.2em] uppercase font-bold text-slate-300">
              Authenticity Guaranteed
            </div>
          </div>
        </div>
        
        {/* Print Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 opacity-[0.03] text-[10rem] font-serif font-bold pointer-events-none select-none hidden print:block">
          LUXESTORE
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
