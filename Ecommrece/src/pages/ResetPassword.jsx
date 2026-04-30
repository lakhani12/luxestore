import React, { useState } from 'react';
import { Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { userService } from '../services/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setStatus({ type: 'error', message: 'Passwords do not match.' });
    }
    
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      const response = await userService.resetPassword(token, { newPassword: password });
      setStatus({ type: 'success', message: response.data.message });
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to reset password.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-luxury-gold-light">
      <div className="max-w-md w-full bg-white rounded-none shadow-2xl border border-luxury-gold/10 overflow-hidden">
        <div className="bg-luxury-navy p-12 text-white text-center relative overflow-hidden">
          <h2 className="text-4xl font-serif italic mb-2 relative z-10">New Credentials</h2>
          <p className="text-slate-400 text-xs tracking-widest uppercase font-bold relative z-10">Securing your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {status.type === 'success' ? (
            <div className="text-center py-8 space-y-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <p className="text-sm font-light text-slate-600 italic">Your password has been successfully updated. Redirecting you to the login suite...</p>
              <Link to="/login" className="btn-premium inline-block px-10">Login Now</Link>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.2em] text-luxury-navy uppercase mb-3">New Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-none focus:border-luxury-gold outline-none transition-all"
                    />
                    <Lock className="absolute left-3 top-4.5 text-luxury-gold/40 w-4 h-4" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-[0.2em] text-luxury-navy uppercase mb-3">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-none focus:border-luxury-gold outline-none transition-all"
                    />
                    <Lock className="absolute left-3 top-4.5 text-luxury-gold/40 w-4 h-4" />
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
                className="w-full btn-premium py-5 flex items-center justify-center disabled:opacity-50 shadow-xl"
              >
                {loading ? 'Updating...' : <>Finalize Changes <ArrowRight className="ml-2 w-4 h-4" /></>}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
