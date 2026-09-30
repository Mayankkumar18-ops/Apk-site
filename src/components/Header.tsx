import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Download,
  Search,
  Grid,
  Shield,
  Code,
  User as UserIcon,
  LogOut,
  PlusCircle,
  Settings,
  Users,
  CheckSquare,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  Bookmark,
  UserPlus,
  Home as HomeIcon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppCategory } from '../types';

const CATEGORIES: AppCategory[] = [
  'Games',
  'Tools',
  'Social',
  'Productivity',
  'Media',
  'Education',
  'Personalization',
  'Finance',
];

export const Header: React.FC = () => {
  const { currentUser, currentRole, apps, logout } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const pendingCount = apps.filter((a) => a.status === 'Pending').length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleCategorySelect = (cat: string) => {
    navigate(`/browse?category=${encodeURIComponent(cat)}`);
    setIsCategoryOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
      {/* Top Bar for Instant Role & Account Operations */}
      <div className="bg-slate-950 border-b border-slate-800/80 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline font-medium">Active Role:</span>
            <span className="font-bold uppercase tracking-wider text-white">
              <span className="text-indigo-400">{currentRole}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-slate-500 hidden lg:inline text-[11px] font-medium">Access Portals:</span>
            <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-xl border border-slate-800">
              {(() => {
                const activePortal = location.pathname.startsWith('/admin')
                  ? 'admin'
                  : location.pathname.startsWith('/dev')
                  ? 'developer'
                  : location.pathname.startsWith('/user')
                  ? 'user'
                  : (currentUser ? currentRole : '');

                return (
                  <>
                    <button
                      onClick={() => navigate(currentUser && currentRole === 'user' ? '/user/dashboard' : '/user/login')}
                      className={`relative px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 z-10 ${
                        activePortal === 'user' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {activePortal === 'user' && (
                        <motion.div
                          layoutId="activeControlPanelBg"
                          className="absolute inset-0 bg-indigo-600 rounded-lg -z-10 shadow-xs"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}
                      <UserIcon className="w-3 h-3" />
                      <span>User Portal</span>
                    </button>

                    <button
                      onClick={() => navigate(currentUser && currentRole === 'developer' ? '/dev/dashboard' : '/dev/login')}
                      className={`relative px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 z-10 ${
                        activePortal === 'developer' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {activePortal === 'developer' && (
                        <motion.div
                          layoutId="activeControlPanelBg"
                          className="absolute inset-0 bg-indigo-600 rounded-lg -z-10 shadow-xs"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}
                      <Code className="w-3 h-3" />
                      <span>Dev Console</span>
                    </button>

                    <button
                      onClick={() => navigate(currentUser && currentRole === 'admin' ? '/admin/dashboard' : '/admin/login')}
                      className={`relative px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 z-10 ${
                        activePortal === 'admin' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {activePortal === 'admin' && (
                        <motion.div
                          layoutId="activeControlPanelBg"
                          className="absolute inset-0 bg-amber-600 rounded-lg -z-10 shadow-xs"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}
                      <Shield className="w-3 h-3" />
                      <span>Admin Center</span>
                    </button>
                  </>
                );
              })()}
            </div>

            <div className="h-3 w-px bg-slate-800 mx-1 hidden sm:block"></div>

            <Link
              to="/dev/signup"
              className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition flex items-center gap-1 border border-emerald-500/20"
            >
              <UserPlus className="w-3 h-3" /> Developer Register
            </Link>
            <Link
              to="/user/login"
              className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition flex items-center gap-1 border border-slate-700"
            >
              <UserIcon className="w-3 h-3" /> User Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight flex items-center gap-1 text-white">
              APK <span className="text-indigo-400">WORLD</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ml-1">PRO</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium block -mt-1 hidden sm:block">Verified Android Repository</span>
          </div>
        </Link>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search APKs, games, tools..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2" />
        </form>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-slate-300">
          <Link
            to="/"
            className={`flex items-center gap-1.5 hover:text-white transition ${
              location.pathname === '/' ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            <HomeIcon className="w-4 h-4" />
            <span>Home</span>
          </Link>

          <Link
            to="/browse"
            className={`flex items-center gap-1.5 hover:text-white transition ${
              location.pathname === '/browse' ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Browse</span>
          </Link>

          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center gap-1 hover:text-white py-2 transition"
            >
              <span>Categories</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {isCategoryOpen && (
              <div
                className="absolute top-full left-0 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 mt-1"
                onMouseLeave={() => setIsCategoryOpen(false)}
              >
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Role Specific Actions */}
          {currentRole === 'developer' && (
            <>
              <Link
                to="/dev/dashboard"
                className={`flex items-center gap-1.5 hover:text-white transition ${
                  location.pathname === '/dev/dashboard' ? 'text-indigo-400 font-semibold' : ''
                }`}
              >
                <Code className="w-4 h-4" />
                <span>Dev Portal</span>
              </Link>
              <Link
                to="/dev/publish"
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Publish APK</span>
              </Link>
            </>
          )}

          {currentRole === 'admin' && (
            <>
              <Link
                to="/admin/dashboard"
                className={`flex items-center gap-1.5 hover:text-white transition ${
                  location.pathname === '/admin/dashboard' ? 'text-amber-400 font-semibold' : ''
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>

              <Link
                to="/admin/moderation"
                className="relative flex items-center gap-1 hover:text-white transition"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Queue</span>
                {pendingCount > 0 && (
                  <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </Link>

              <Link to="/admin/developers" className="hover:text-white transition" title="Manage Accounts">
                <Users className="w-4 h-4" />
              </Link>
              <Link to="/admin/settings" className="hover:text-white transition" title="Settings">
                <Settings className="w-4 h-4" />
              </Link>
            </>
          )}

          {currentRole === 'user' && (
            <Link
              to="/user/dashboard"
              className={`flex items-center gap-1.5 hover:text-white transition ${
                location.pathname === '/user/dashboard' ? 'text-indigo-400 font-semibold' : ''
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>My Downloads</span>
            </Link>
          )}
        </nav>

        {/* Right User Auth Menu */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 rounded-full border border-slate-800 hover:border-slate-700 transition bg-slate-950"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-xs font-semibold text-slate-200 hidden sm:inline">{currentUser.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:inline" />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50"
                  onMouseLeave={() => setIsProfileOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs font-bold text-white">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 uppercase">
                      Role: {currentRole}
                    </span>
                  </div>

                  {currentRole === 'user' && (
                    <Link
                      to="/user/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-indigo-400" /> User Dashboard
                    </Link>
                  )}

                  {currentRole === 'developer' && (
                    <>
                      <Link
                        to="/dev/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                      >
                        <Code className="w-3.5 h-3.5 text-indigo-400" /> Dev Dashboard
                      </Link>
                      <Link
                        to="/dev/publish"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                      >
                        <PlusCircle className="w-3.5 h-3.5 text-indigo-400" /> Publish New APK
                      </Link>
                    </>
                  )}

                  {currentRole === 'admin' && (
                    <>
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                      >
                        <Shield className="w-3.5 h-3.5 text-amber-400" /> Admin Overview
                      </Link>
                      <Link
                        to="/admin/developers"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                      >
                        <Users className="w-3.5 h-3.5 text-amber-400" /> Account Management
                      </Link>
                    </>
                  )}

                  <div className="border-t border-slate-800 my-1"></div>

                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/user/login"
                className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-slate-800 hover:border-slate-700 transition"
              >
                Log In
              </Link>
              <Link
                to="/user/signup"
                className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-1.5 rounded-xl shadow-md transition"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search APKs..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          </form>

          <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-slate-800 text-xs font-semibold text-indigo-400 flex items-center gap-2"
            >
              <HomeIcon className="w-4 h-4" />
              <span>Homepage</span>
            </Link>

            <Link
              to="/browse"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-slate-800 text-xs text-slate-200 flex items-center gap-2"
            >
              <Grid className="w-4 h-4" />
              <span>Browse All Apps</span>
            </Link>

            <div className="px-3 py-1 text-[10px] font-semibold text-slate-500 uppercase">Categories</div>
            <div className="grid grid-cols-2 gap-1 px-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className="text-left text-xs text-slate-400 py-1 hover:text-white"
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="border-t border-slate-800 my-2"></div>

            <div className="flex gap-2">
              <Link
                to="/dev/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 py-2 text-center rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-md"
              >
                Developer Register
              </Link>
              <Link
                to="/user/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 py-2 text-center rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold"
              >
                User Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
