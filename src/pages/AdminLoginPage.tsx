import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, ArrowRight, Download, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminLoginPage: React.FC = () => {
  const { loginAsAdmin } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsAdmin();
    navigate('/');
  };

  const handleQuickAdmin = () => {
    loginAsAdmin();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
        <div className="text-center">
          <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-600/30 text-white font-bold">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Administrator Control Panel</h2>
          <p className="text-xs text-slate-400 mt-1">Store moderation queue, developer management, and site settings</p>
        </div>

        {/* Quick Sign In Box */}
        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-semibold text-amber-400">
            <Sparkles className="w-4 h-4 text-amber-400" /> Admin Quick Access:
          </div>
          <p className="text-slate-300 text-[11px]">Log in as System Admin to review pending submissions, approve/reject apps, and manage developers.</p>
          <button
            onClick={handleQuickAdmin}
            type="button"
            className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold py-1.5 rounded-lg text-xs transition shadow-md"
          >
            One-Click Login as Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@apkworld.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <Shield className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Security Key / Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20"
          >
            Enter Admin Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
