import React from 'react';
import { Link } from 'react-router-dom';
import { Download, ShieldCheck, Zap, Lock, Code, Heart, UserPlus, Home } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30">
                <Download className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">APK WORLD</span>
            </Link>
            <p className="text-slate-400 leading-relaxed font-normal">
              The premier community-curated Android APK repository. Discover verified tools, games, launchers, and utilities with full developer transparency.
            </p>
            <div className="pt-1">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-xl border border-indigo-500/20 transition"
              >
                <Home className="w-3.5 h-3.5 text-indigo-400" /> Go Direct to Homepage
              </Link>
            </div>
            <div className="flex items-center gap-3 pt-1 text-slate-300 font-medium">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Safe & Virus-Free</span>
              <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-400" /> Fast Mirror</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 mb-3 uppercase tracking-wider">Top Categories</h4>
            <ul className="space-y-2 font-medium">
              <li><Link to="/browse?category=Tools" className="hover:text-white transition flex items-center gap-1">🛠️ System Tools & Utilities</Link></li>
              <li><Link to="/browse?category=Productivity" className="hover:text-white transition flex items-center gap-1">⚡ Productivity & Notes</Link></li>
              <li><Link to="/browse?category=Education" className="hover:text-white transition flex items-center gap-1">🎓 Education & Learning</Link></li>
              <li><Link to="/browse?category=Finance" className="hover:text-white transition flex items-center gap-1">💳 Finance & Crypto</Link></li>
              <li><Link to="/browse?category=Games" className="hover:text-white transition flex items-center gap-1">🎮 Action & Arcade Games</Link></li>
              <li><Link to="/browse?category=Personalization" className="hover:text-white transition flex items-center gap-1">🎨 Launchers & Themes</Link></li>
            </ul>
          </div>

          {/* Quick Portals & Adding Accounts */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 mb-3 uppercase tracking-wider">Portals & Navigation</h4>
            <ul className="space-y-2 font-medium">
              <li><Link to="/" className="text-indigo-400 font-semibold hover:text-indigo-300 flex items-center gap-1.5 transition"><Home className="w-3.5 h-3.5" /> Homepage</Link></li>
              <li><Link to="/browse" className="hover:text-white transition">Browse All APKs</Link></li>
              <li><Link to="/user/login" className="hover:text-white transition">User Account Sign In</Link></li>
              <li><Link to="/dev/login" className="hover:text-white transition">Developer Publishing Console</Link></li>
              <li><Link to="/dev/signup" className="hover:text-white text-indigo-400 flex items-center gap-1 transition"><UserPlus className="w-3.5 h-3.5" /> Developer Register</Link></li>
              <li><Link to="/admin/login" className="hover:text-white transition text-slate-300">Admin Control Center</Link></li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 mb-3 uppercase tracking-wider">Security & Terms</h4>
            <ul className="space-y-2 font-medium">
              <li className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-slate-500" /> Privacy Policy</li>
              <li className="flex items-center gap-1.5"><Code className="w-3.5 h-3.5 text-slate-500" /> Terms of Service</li>
              <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-slate-500" /> Developer Guidelines</li>
              <li>DMCA Takedown Requests</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© 2026 APK World. Built for Android Power Users & Independent Developers.</p>
          <div className="flex items-center gap-1 text-slate-400">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-0.5" /> using React & Tailwind CSS
          </div>
        </div>
      </div>
    </footer>
  );
};
