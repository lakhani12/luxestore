import React, { useState } from 'react';
import { CreditCard, Truck, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/api';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, fetchCart } = useCart();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '',
    address: '', city: '', zip: '',
    cardNumber: '', expiry: '', cvc: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const shipping = cart.length > 0 ? 15 : 0;
  const total = cartTotal + shipping;

  const validateStep1 = () => {
    let newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Invalid Email';
    if (!formData.address.trim()) newErrors.address = 'Required';
    if (!formData.city.trim()) newErrors.city = 'Required';
    if (!formData.zip.match(/^\d{5,6}$/)) newErrors.zip = 'Invalid ZIP';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
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

  const handleComplete = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    if (cart.length === 0) return alert("Your bag is empty");
    
    setLoading(true);
    try {
      const items = cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));

      await orderService.createOrder({ items });
      await fetchCart();
      navigate('/order-confirmation');
    } catch (err) {
      console.error("Order failed", err);
      alert(err.response?.data?.message || 'Checkout failed. Please try again.');
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
                      type="text" placeholder="New York" className={inputClass('city')}
                      value={formData.city}
                      onChange={(e) => { setFormData({...formData, city: e.target.value}); setErrors({...errors, city: ''}); }}
                    />
                    {errors.city && <p className="text-red-500 text-[10px] uppercase font-bold">{errors.city}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold tracking-widest text-luxury-navy uppercase">ZIP Code</label>
                    <input 
                      type="text" placeholder="10001" className={inputClass('zip')}
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
                <h3 className="text-2xl font-serif text-luxury-navy border-b border-luxury-gold/10 pb-6 italic">Secure Payment</h3>
                
                <div className="p-10 bg-luxury-navy text-white rounded-none mb-12 flex justify-between items-center relative overflow-hidden">
                  <div className="space-y-8 relative z-10">
                    <p className="text-[10px] tracking-[0.4em] uppercase opacity-40 font-bold">Preferred Client Card</p>
                    <p className="text-2xl tracking-[0.3em] font-light">
                      {formData.cardNumber ? formData.cardNumber.replace(/\d(?=\d{4})/g, "*") : "**** **** **** 4242"}
                    </p>
                    <div className="flex space-x-12">
                      <div>
                        <p className="text-[8px] tracking-[0.2em] uppercase opacity-40 mb-1">Expiry</p>
                        <p className="text-xs font-bold tracking-widest">{formData.expiry || 'MM/YY'}</p>
                      </div>
                      <div>
                        <p className="text-[8px] tracking-[0.2em] uppercase opacity-40 mb-1">Card Holder</p>
                        <p className="text-xs font-bold tracking-widest uppercase">{formData.firstName || 'Signature'} {formData.lastName || 'Member'}</p>
                      </div>
                    </div>
                  </div>
                  <CreditCard className="w-20 h-20 opacity-10 relative z-10" />
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold tracking-widest text-luxury-navy uppercase">Card Number (16 digits)</label>
                    <input 
                      type="text" maxLength="16" placeholder="0000 0000 0000 0000" className={inputClass('cardNumber')}
                      onChange={(e) => { setFormData({...formData, cardNumber: e.target.value}); setErrors({...errors, cardNumber: ''}); }}
                    />
                    {errors.cardNumber && <p className="text-red-500 text-[10px] uppercase font-bold">{errors.cardNumber}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold tracking-widest text-luxury-navy uppercase">Expiry (MM/YY)</label>
                      <input 
                        type="text" placeholder="12/28" className={inputClass('expiry')}
                        onChange={(e) => { setFormData({...formData, expiry: e.target.value}); setErrors({...errors, expiry: ''}); }}
                      />
                      {errors.expiry && <p className="text-red-500 text-[10px] uppercase font-bold">{errors.expiry}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold tracking-widest text-luxury-navy uppercase">CVC (3 digits)</label>
                      <input 
                        type="password" maxLength="3" placeholder="***" className={inputClass('cvc')}
                        onChange={(e) => { setFormData({...formData, cvc: e.target.value}); setErrors({...errors, cvc: ''}); }}
                      />
                      {errors.cvc && <p className="text-red-500 text-[10px] uppercase font-bold">{errors.cvc}</p>}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-6 pt-6">
                  <button type="button" onClick={() => setStep(1)} className="btn-outline-premium flex-1 py-5">Back</button>
                  <button 
                    type="button" 
                    onClick={handleComplete} 
                    disabled={loading}
                    className="btn-premium flex-[2] py-5 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Finalize Purchase'}
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
                  <span className="text-luxury-gold font-bold">${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-4 text-xs tracking-widest uppercase border-t border-luxury-gold/10 pt-8 mb-8">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-luxury-navy font-bold">${cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Luxury Shipping</span>
                <span className="text-luxury-navy font-bold">${shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-luxury-gold font-bold text-lg pt-4">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
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
    </div>
  );
};

export default Checkout;
