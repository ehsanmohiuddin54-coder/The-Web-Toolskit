
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp, isValidEmail } from '../utils/auth-store';
import { useAuth } from '../components/AuthContext';

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Invalid Credentials');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    try {
      const user = signUp(email, name, password);
      setAuthUser(user);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Error creating account');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-in zoom-in-95 duration-300">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100 border border-slate-100 p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Create Account</h2>
            <p className="text-slate-500">Join our community of SEO experts</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 animate-in shake duration-300">
              <div className="flex items-center space-x-2">
                <span className="text-lg">⚠️</span>
                <span className="font-semibold">{error}</span>
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSignUp}>
             <div>
               <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
               <input 
                  type="text" 
                  required
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    if(error) setError('');
                  }}
                  placeholder="John Doe"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                />
             </div>
             <div>
               <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
               <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    if(error) setError('');
                  }}
                  placeholder="name@gmail.com"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                />
               <p className="text-[10px] text-slate-400 mt-1 ml-1 font-medium italic">Support valid Credentials</p>
             </div>
             <div>
               <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
               <input 
                  type="password" 
                  required
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if(error) setError('');
                  }}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                />
             </div>
             <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
               Sign Up
             </button>
          </form>

          <div className="mt-10 text-center text-sm text-slate-500">
            Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
