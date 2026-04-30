import React, { useState } from 'react';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { userService } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      const response = await userService.forgetPassword({ email });
      setStatus({ type: 'success', message: response.data.message });
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to send reset email.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-luxury-gold-light">
      <div className="max-w-md w-full bg-white rounded-none shadow-2xl border border-luxury-gold/10 overflow-hidden">
        <div className="bg-luxury-navy p-12 text-white text-center relative overflow-hidden">
          <h2 className="text-4xl font-serif italic mb-2 relative z-10">Reset Password</h2>
          <p className="text-slate-400 text-xs tracking-widest uppercase font-bold relative z-10">Restore your access</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <p className="text-xs text-slate-500 font-light leading-relaxed text-center">
            Enter the email address associated with your account and we'll send you a link to reset your password.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold tracking-[0.2em] text-luxury-navy uppercase mb-3">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@luxestore.com"
                  className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-none focus:border-luxury-gold outline-none transition-all placeholder:text-slate-300"
                />
                <Mail className="absolute left-3 top-4.5 text-luxury-gold/40 w-4 h-4" />
              </div>
            </div>
          </div>

          {status.message && (
            <div className={`p-4 text-[10px] font-bold tracking-widest uppercase ${status.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
              {status.message}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-premium py-5 flex items-center justify-center disabled:opacity-50"
          >
            {loading ? 'Processing...' : <><Send className="w-4 h-4 mr-2" /> Send Reset Link</>}
          </button>

          <div className="text-center">
            <Link to="/login" className="inline-flex items-center text-[10px] tracking-widest uppercase font-bold text-luxury-navy hover:text-luxury-gold transition-colors">
              <ArrowLeft className="w-3 h-3 mr-2" /> Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
