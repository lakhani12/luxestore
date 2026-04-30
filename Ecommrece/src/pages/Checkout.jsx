import React, { useState } from 'react';
import { CreditCard, Truck, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { orderService, paymentService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, fetchCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    firstName: user?.username?.split(' ')[0] || '', 
    lastName: user?.username?.split(' ')[1] || '', 
    email: user?.email || '',
    address: '', city: '', zip: '',
    cardNumber: '', expiry: '', cvc: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showMockPayment, setShowMockPayment] = useState(false);
  const [mockOrderId, setMockOrderId] = useState('');

  const shipping = cart.length > 0 ? 15 : 0;
  const total = cartTotal + shipping;

  const validateStep1 = () => {
    let newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Invalid Email';
    if (!formData.address.trim()) newErrors.address = 'Required';
    if (!formData.city.trim()) newErrors.city = 'Required';
    if (!formData.zip.match(/^\d{6}$/)) newErrors.zip = 'Invalid PIN (6 digits)';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    if (paymentMethod !== 'card') return true;
    let newErrors = {};
    if (!formData.cardNumber.match(/^\d{16}$/)) newErrors.cardNumber = 'Must be 16 digits';
    if (!formData.expiry.match(/^\d{2}\/\d{2}$/)) newErrors.expiry = 'MM/YY';
    if (!formData.cvc.match(/^\d{3}$/)) newErrors.cvc = '3 digits';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleComplete = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    if (cart.length === 0) return alert("Your bag is empty");
    
    setLoading(true);
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setLoading(false);
        return;
      }

      // 1. Create Razorpay Order on server
      const razorpayOrderRes = await paymentService.createRazorpayOrder(total);
      const { order_id, amount, currency } = razorpayOrderRes.data;

      // Check if it's a dummy order
      if (order_id.startsWith('order_dmy_')) {
        setMockOrderId(order_id);
        setShowMockPayment(true);
        setLoading(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: amount,
        currency: currency,
        name: "LUXE STORE",
        description: "Excellence in Luxury Acquisition",
        order_id: order_id,
        handler: async (response) => {
          try {
            // 2. Verify Payment on server
            const verificationRes = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verificationRes.data.success) {
              // 3. Create actual order in DB
              const items = cart.map(item => ({
                productId: item.productId,
                quantity: item.quantity
              }));

              await orderService.createOrder({ 
                items,
                paymentDetails: {
                  method: 'razorpay',
                  transactionId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id
                }
              });

              await fetchCart();
              navigate('/order-confirmation', { 
                state: { 
                  orderDetails: { total, items, formData, paymentMethod: 'Razorpay' } 
                } 
              });
            }
          } catch (err) {
            console.error("Payment verification or order creation failed", err);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
        },
        theme: {
          color: "#0f172a", // luxury navy
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Checkout process failed", err);
      const errorMsg = err.response?.data?.message || err.message || 'Checkout failed. Please try again.';
      const status = err.response?.status ? ` (Status: ${err.response.status})` : '';
      alert(`${errorMsg}${status}`);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) => `w-full p-4 bg-slate-50 border ${errors[field] ? 'border-red-500' : 'border-slate-100'} outline-none focus:border-luxury-gold transition-all text-sm`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-luxury-gold-light min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-serif text-luxury-navy mb-4 italic tracking-tight">Secure Checkout</h1>
        <div className="flex justify-center items-center space-x-6 mt-8">
          <div className={`flex items-center space-x-3 ${step >= 1 ? 'text-luxury-gold' : 'text-slate-300'}`}>
            <span className={`w-10 h-10 rounded-none border flex items-center justify-center font-bold text-xs transition-all ${step >= 1 ? 'border-luxury-gold bg-luxury-gold text-white' : 'border-slate-200'}`}>01</span>
            <span className="text-[10px] tracking-[0.3em] uppercase font-bold">Shipping</span>
          </div>
          <div className="w-16 h-[1px] bg-luxury-gold/20"></div>
          <div className={`flex items-center space-x-3 ${step >= 2 ? 'text-luxury-gold' : 'text-slate-300'}`}>
            <span className={`w-10 h-10 rounded-none border flex items-center justify-center font-bold text-xs transition-all ${step >= 2 ? 'border-luxury-gold bg-luxury-gold text-white' : 'border-slate-200'}`}>02</span>
            <span className="text-[10px] tracking-[0.3em] uppercase font-bold">Payment</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        <div className="lg:col-span-8">
          <div className="bg-white p-12 shadow-2xl border border-luxury-gold/10">
            {step === 1 ? (
              <div className="animate-fade-in space-y-8">
                <h3 className="text-2xl font-serif text-luxury-navy border-b border-luxury-gold/10 pb-6 italic">Delivery Address</h3>
                
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold tracking-widest text-luxury-navy uppercase">First Name</label>
                    <input 
                      type="text" placeholder="John" className={inputClass('firstName')}
                      value={formData.firstName}
                      onChange={(e) => { setFormData({...formData, firstName: e.target.value}); setErrors({...errors, firstName: ''}); }}
                    />
                    {errors.firstName && <p className="text-red-500 text-[10px] uppercase font-bold">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold tracking-widest text-luxury-navy uppercase">Last Name</label>
                    <input 
                      type="text" placeholder="Doe" className={inputClass('lastName')}
                      value={formData.lastName}
                      onChange={(e) => { setFormData({...formData, lastName: e.target.value}); setErrors({...errors, lastName: ''}); }}
                    />
                    {errors.lastName && <p className="text-red-500 text-[10px] uppercase font-bold">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold tracking-widest text-luxury-navy uppercase">Email Address</label>
                  <input 
                    type="email" placeholder="john@example.com" className={inputClass('email')}
                    value={formData.email}
                    onChange={(e) => { setFormData({...formData, email: e.target.value}); setErrors({...errors, email: ''}); }}
                  />
                  {errors.email && <p className="text-red-500 text-[10px] uppercase font-bold">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold tracking-widest text-luxury-navy uppercase">Full Address</label>
                  <input 
                    type="text" placeholder="123 Luxury Lane" className={inputClass('address')}
                    value={formData.address}
                    onChange={(e) => { setFormData({...formData, address: e.target.value}); setErrors({...errors, address: ''}); }}
                  />
                  {errors.address && <p className="text-red-500 text-[10px] uppercase font-bold">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold tracking-widest text-luxury-navy uppercase">City</label>
                    <input 
                      type="text" placeholder="Mumbai" className={inputClass('city')}
                      value={formData.city}
                      onChange={(e) => { setFormData({...formData, city: e.target.value}); setErrors({...errors, city: ''}); }}
                    />
                    {errors.city && <p className="text-red-500 text-[10px] uppercase font-bold">{errors.city}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold tracking-widest text-luxury-navy uppercase">ZIP Code</label>
                    <input 
                      type="text" placeholder="400001" className={inputClass('zip')}
                      value={formData.zip}
                      onChange={(e) => { setFormData({...formData, zip: e.target.value}); setErrors({...errors, zip: ''}); }}
                    />
                    {errors.zip && <p className="text-red-500 text-[10px] uppercase font-bold">{errors.zip}</p>}
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={handleNext}
                  className="w-full btn-premium py-5 mt-4"
                >
                  Proceed to Payment
                </button>
              </div>
            ) : (
              <div className="animate-fade-in space-y-10">
                <h3 className="text-2xl font-serif text-luxury-navy border-b border-luxury-gold/10 pb-6 italic">Payment Method</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                  {[
                    { id: 'card', name: 'Card', icon: CreditCard },
                    { id: 'upi', name: 'UPI', icon: ShieldCheck },
                    { id: 'apple', name: 'Apple Pay', icon: CheckCircle2 },
                    { id: 'bank', name: 'Net Banking', icon: Truck }
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex flex-col items-center justify-center p-6 border transition-all ${paymentMethod === method.id ? 'border-luxury-gold bg-luxury-gold/5 text-luxury-navy' : 'border-slate-100 text-slate-400 grayscale'}`}
                    >
                      <method.icon className="w-6 h-6 mb-3" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{method.name}</span>
                    </button>
                  ))}
                </div>

                <div className="p-12 text-center border border-luxury-gold/20 bg-slate-50/30 animate-fade-in space-y-8">
                  <div className="w-20 h-20 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-10 h-10 text-luxury-gold" />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-2xl font-serif italic text-luxury-navy">Razorpay Secure Gateway</h4>
                    <p className="text-sm text-slate-500 font-light max-w-md mx-auto leading-relaxed">
                      You are about to be redirected to our secure payment partner. We support all major Indian payment methods:
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6 max-w-sm mx-auto opacity-60">
                    <div className="flex flex-col items-center">
                      <CreditCard className="w-6 h-6 mb-2" />
                      <span className="text-[8px] font-bold uppercase tracking-widest">Cards</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <ShieldCheck className="w-6 h-6 mb-2" />
                      <span className="text-[8px] font-bold uppercase tracking-widest">UPI</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Truck className="w-6 h-6 mb-2" />
                      <span className="text-[8px] font-bold uppercase tracking-widest">Banking</span>
                    </div>
                  </div>

                  <div className="pt-6">
                    <div className="flex items-center justify-center space-x-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      <ShieldCheck className="w-3 h-3 text-green-500" />
                      <span>PCI-DSS Compliant 256-bit Encryption</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-6 pt-10 border-t border-slate-100">
                  <button type="button" onClick={() => setStep(1)} className="btn-outline-premium flex-1 py-5">Back to Shipping</button>
                  <button 
                    type="button" 
                    onClick={handleComplete} 
                    disabled={loading}
                    className="btn-premium flex-[2] py-5 disabled:opacity-50 relative overflow-hidden"
                  >
                    <span className={loading ? 'opacity-0' : 'opacity-100'}>
                      Authorize ₹{total.toLocaleString('en-IN')}
                    </span>
                    {loading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-10 border border-luxury-gold/10 shadow-xl">
            <h3 className="font-serif text-2xl text-luxury-navy mb-8 italic">Your Order</h3>
            <div className="space-y-6 mb-10">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex flex-col">
                    <span className="text-luxury-navy font-bold italic">{item.name}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Qty: {item.quantity}</span>
                  </div>
                  <span className="text-luxury-gold font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-4 text-xs tracking-widest uppercase border-t border-luxury-gold/10 pt-8 mb-8">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-luxury-navy font-bold">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Luxury Shipping</span>
                <span className="text-luxury-navy font-bold">₹{shipping.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-luxury-gold font-bold text-lg pt-4">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-luxury-gold/5">
              <div className="flex items-center text-[9px] tracking-[0.2em] uppercase font-bold text-slate-400">
                <Truck className="w-4 h-4 mr-3 text-luxury-gold" /> Complimentary Signature Delivery
              </div>
              <div className="flex items-center text-[9px] tracking-[0.2em] uppercase font-bold text-slate-400">
                <ShieldCheck className="w-4 h-4 mr-3 text-luxury-gold" /> Guaranteed Boutique Authentication
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mock Payment Modal */}
      {showMockPayment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-luxury-navy/90 backdrop-blur-md"></div>
          <div className="relative bg-white w-full max-w-md p-10 shadow-2xl border-l-4 border-luxury-gold">
            <div className="flex justify-between items-center mb-10">
              <h4 className="text-xl font-serif italic text-luxury-navy">Simulation Gateway</h4>
              <span className="text-[8px] font-bold uppercase tracking-widest px-3 py-1 bg-luxury-gold/10 text-luxury-gold">Test Mode</span>
            </div>
            
            <div className="space-y-6 mb-10">
              <div className="p-6 bg-slate-50 border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2">Transaction Amount</p>
                <p className="text-2xl font-bold text-luxury-navy">₹{total.toLocaleString('en-IN')}</p>
              </div>
              <p className="text-sm text-slate-500 font-light leading-relaxed">
                You are currently in the <span className="text-luxury-gold font-bold">LuxeStore Simulation Environment</span>. No real funds will be deducted from your account.
              </p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={async () => {
                  setLoading(true);
                  try {
                    const verificationRes = await paymentService.verifyPayment({
                      razorpay_order_id: mockOrderId,
                      razorpay_payment_id: 'pay_mock_' + Math.random().toString(36).substr(2, 9),
                      razorpay_signature: 'mock_sig'
                    });

                    if (verificationRes.data.success) {
                      const items = cart.map(item => ({ productId: item.productId, quantity: item.quantity }));
                      await orderService.createOrder({ 
                        items,
                        paymentDetails: { method: 'razorpay_demo', transactionId: 'MOCK_TXN_' + Date.now() }
                      });
                      await fetchCart();
                      navigate('/order-confirmation', { 
                        state: { orderDetails: { total, items, formData, paymentMethod: 'Demo Payment' } } 
                      });
                    }
                  } catch (err) {
                    alert("Simulation failed. Please try again.");
                  } finally {
                    setLoading(false);
                    setShowMockPayment(false);
                  }
                }}
                disabled={loading}
                className="w-full btn-premium py-5 flex items-center justify-center"
              >
                {loading ? 'Processing...' : 'Simulate Success'}
              </button>
              <button 
                onClick={() => setShowMockPayment(false)}
                className="w-full text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
              >
                Cancel Simulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
