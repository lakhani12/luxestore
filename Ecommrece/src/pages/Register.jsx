import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Github } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      await userService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-luxury-gold-light">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-luxury-navy p-8 text-white text-center">
          <h2 className="text-3xl font-serif font-bold">Join LuxeStore</h2>
          <p className="text-slate-300 mt-2 font-light">Create an account to start your journey</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium border border-red-100">{error}</div>}

          <div>
            <label className="block text-xs font-bold tracking-widest text-luxury-navy uppercase mb-2">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-none focus:ring-1 focus:ring-luxury-gold focus:bg-white outline-none transition-all"
              />
              <User className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest text-luxury-navy uppercase mb-2">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-none focus:ring-1 focus:ring-luxury-gold focus:bg-white outline-none transition-all"
              />
              <Mail className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold tracking-widest text-luxury-navy uppercase mb-2">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-none focus:ring-1 focus:ring-luxury-gold focus:bg-white outline-none transition-all"
                />
                <Lock className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest text-luxury-navy uppercase mb-2">Confirm</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-none focus:ring-1 focus:ring-luxury-gold focus:bg-white outline-none transition-all"
                />
                <Lock className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-premium py-4 flex items-center justify-center disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : <>Create Account <ArrowRight className="ml-2 w-5 h-5" /></>}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-slate-500 uppercase tracking-widest font-bold">Already a member?</span>
            </div>
          </div>

          <Link to="/login" className="w-full btn-outline-premium py-4 flex items-center justify-center">
            Sign In Instead
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
