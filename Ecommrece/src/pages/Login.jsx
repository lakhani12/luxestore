import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { fetchCart } = useCart();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await login(formData);
      await fetchCart();
      
      const role = response.data.checkUser?.role?.toLowerCase();
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdmin = () => {
    setFormData({ email: 'admin@luxestore.com', password: 'Admin123!' });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-luxury-gold-light">
      <div className="max-w-md w-full bg-white rounded-none shadow-2xl border border-luxury-gold/10 overflow-hidden">
        <div className="bg-luxury-navy p-12 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <h2 className="text-4xl font-serif italic mb-2 relative z-10">Welcome Back</h2>
          <p className="text-slate-400 text-xs tracking-widest uppercase font-bold relative z-10">The Elite Circle Awaits</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 text-xs font-bold tracking-tight border-l-4 border-red-500 animate-fade-in">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold tracking-[0.2em] text-luxury-navy uppercase mb-3">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="you@luxestore.com"
                  className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-none focus:border-luxury-gold outline-none transition-all placeholder:text-slate-300"
                />
                <Mail className="absolute left-3 top-4.5 text-luxury-gold/40 w-4 h-4" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-[0.2em] text-luxury-navy uppercase mb-3">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-none focus:border-luxury-gold outline-none transition-all placeholder:text-slate-300"
                />
                <Lock className="absolute left-3 top-4.5 text-luxury-gold/40 w-4 h-4" />
              </div>
              <div className="flex justify-end mt-2">
                <Link to="/forgot-password" virtual-link="forgot-password" id="forgot-password"  className="text-[10px] font-bold tracking-widest uppercase text-luxury-gold hover:text-luxury-navy transition-colors">
                  Forgot Password?
                </Link>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-premium py-5 flex items-center justify-center disabled:opacity-50 shadow-xl"
          >
            {loading ? 'Authenticating...' : <>Login to Boutique <ArrowRight className="ml-2 w-4 h-4" /></>}
          </button>

          <div className="flex flex-col space-y-4 pt-4 border-t border-slate-50">
            <button 
              type="button"
              onClick={handleQuickAdmin}
              className="w-full flex items-center justify-center py-4 bg-luxury-gold/5 border border-dashed border-luxury-gold/30 text-[10px] tracking-widest font-bold text-luxury-gold hover:bg-luxury-gold hover:text-white transition-all group"
            >
              <ShieldCheck className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> 
              QUICK ADMIN ACCESS
            </button>
            <p className="text-[9px] text-center text-slate-400 font-light italic">Click above to auto-fill development admin credentials</p>
          </div>

          <p className="text-center text-xs text-slate-500 tracking-wide font-light">
            Don't have an account?{' '}
            <Link to="/register" className="text-luxury-gold font-bold hover:underline ml-1">Create One</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
