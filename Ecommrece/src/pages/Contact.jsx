import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { contactService } from '../services/api';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      const response = await contactService.sendEmail(formData);
      setStatus({ type: 'success', message: response.data.message });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to send message. Please try again later.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-luxury-gold-light min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-luxury-gold font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block"
          >
            Concierge Services
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl font-serif text-luxury-navy italic mb-6"
          >
            Connect With Us
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Our dedicated team is here to assist you with any inquiries regarding our collections, private viewings, or bespoke services.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-12">
            <div className="bg-white p-10 border border-luxury-gold/10 shadow-sm">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-luxury-navy mb-8 border-b border-luxury-gold/20 pb-4">Our Atelier</h3>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="p-3 bg-luxury-gold-light text-luxury-gold">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-widest font-bold text-slate-400 uppercase mb-1">Global Headquarters</p>
                    <p className="text-luxury-navy font-serif italic">123 Luxury Lane, Mayfair, London, UK</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="p-3 bg-luxury-gold-light text-luxury-gold">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-widest font-bold text-slate-400 uppercase mb-1">Concierge Line</p>
                    <p className="text-luxury-navy font-serif italic">+44 (0) 20 7946 0000</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="p-3 bg-luxury-gold-light text-luxury-gold">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-widest font-bold text-slate-400 uppercase mb-1">Email Inquiry</p>
                    <p className="text-luxury-navy font-serif italic">concierge@luxestore.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-luxury-navy p-10 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-xl font-serif italic mb-4 text-luxury-gold">Private Appointments</h3>
                <p className="text-sm font-light text-slate-300 leading-relaxed mb-6">
                  Book a personalized session with our lead stylists in our private showroom.
                </p>
                <button className="text-[10px] tracking-[0.3em] font-bold uppercase border-b border-luxury-gold pb-1 hover:text-luxury-gold transition-colors">
                  Schedule Now
                </button>
              </div>
              <MessageCircle className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 group-hover:scale-110 transition-transform duration-700" />
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-12 border border-luxury-gold/10 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-widest font-bold text-slate-400 uppercase">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Enter your name"
                      className="w-full p-4 bg-slate-50 border border-transparent focus:border-luxury-gold focus:bg-white outline-none transition-all text-sm font-light"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-widest font-bold text-slate-400 uppercase">Email Address</label>
                    <input 
                      required
                      type="email" 
                      placeholder="Enter your email"
                      className="w-full p-4 bg-slate-50 border border-transparent focus:border-luxury-gold focus:bg-white outline-none transition-all text-sm font-light"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] tracking-widest font-bold text-slate-400 uppercase">Subject</label>
                  <input 
                    type="text" 
                    placeholder="What are you inquiring about?"
                    className="w-full p-4 bg-slate-50 border border-transparent focus:border-luxury-gold focus:bg-white outline-none transition-all text-sm font-light"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] tracking-widest font-bold text-slate-400 uppercase">Message</label>
                  <textarea 
                    required
                    rows="6" 
                    placeholder="How can we assist you today?"
                    className="w-full p-4 bg-slate-50 border border-transparent focus:border-luxury-gold focus:bg-white outline-none transition-all text-sm font-light resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>

                {status.message && (
                  <div className={`p-4 text-xs font-bold tracking-widest uppercase ${status.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                    {status.message}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full btn-premium py-6 flex items-center justify-center space-x-4 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="animate-pulse">Dispatching...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Dispatch Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
