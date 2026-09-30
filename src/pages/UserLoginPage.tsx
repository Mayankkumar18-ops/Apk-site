import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, Download, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const UserLoginPage: React.FC = () => {
  const { loginAsUser } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsUser(email || 'mayankkumar1489@gmail.com');
    navigate('/');
  };

  const handleQuickLogin = () => {
    loginAsUser('mayankkumar1489@gmail.com');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
        <div className="text-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-600/30 text-white font-bold">
            <Download className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">User Sign In</h2>
          <p className="text-xs text-slate-400 mt-1">Access your APK downloads history & saved favorite apps</p>
        </div>

        {/* Quick Sign In Box */}
        <div className="bg-indigo-950/50 border border-indigo-800/60 p-3.5 rounded-xl text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-indigo-300">
            <Sparkles className="w-4 h-4 text-amber-400" /> Quick Access Account:
          </div>
          <p className="text-slate-300 text-[11px]">Click below to log in immediately as a verified member.</p>
          <button
            onClick={handleQuickLogin}
            type="button"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-1.5 rounded-lg font-semibold text-xs transition"
          >
            One-Click Login as Mayank
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2"
          >
            Sign In to Account <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
          Don't have an account?{' '}
          <Link to="/user/signup" className="text-indigo-400 font-semibold hover:underline">
            Create User Account
          </Link>
        </div>
      </div>
    </div>
  );
};
