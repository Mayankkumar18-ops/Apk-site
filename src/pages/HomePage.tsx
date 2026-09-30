import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Download,
  Star,
  Award,
  Smartphone,
  ShieldCheck,
  TrendingUp,
  Search,
  ChevronRight,
  Flame,
  Zap,
  Code,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppItem } from '../types';

const CATEGORIES = [
  { name: 'Tools', icon: '🛠️' },
  { name: 'Productivity', icon: '⚡' },
  { name: 'Education', icon: '🎓' },
  { name: 'Finance', icon: '💳' },
  { name: 'Games', icon: '🎮' },
  { name: 'Social', icon: '💬' },
  { name: 'Media', icon: '🎥' },
  { name: 'Personalization', icon: '🎨' },
];

export const HomePage: React.FC = () => {
  const { apps, approvedApps: ctxApprovedApps, pendingApps: ctxPendingApps, downloadApp, currentRole, settings } = useApp();
  const [heroSearch, setHeroSearch] = useState('');
  const navigate = useNavigate();

  const approvedApps = ctxApprovedApps || (apps || []).filter((a) => a.status === 'Approved');
  const pendingApps = ctxPendingApps || (apps || []).filter((a) => a.status === 'Pending');

  const heroFeaturedApp = approvedApps.find((a) => a.isFeatured) || approvedApps[0];
  const trendingApps = [...approvedApps].sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0)).slice(0, 6);
  const newReleases = [...approvedApps]
    .sort((a, b) => new Date(b.createdDate || 0).getTime() - new Date(a.createdDate || 0).getTime())
    .slice(0, 6);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Main Bento Hero Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Bento Card 1: Featured App Hero Spotlight (2x2) */}
          <div className="md:col-span-2 md:row-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[360px]">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-indigo-400 text-[11px] font-semibold uppercase tracking-wider mb-4 border border-slate-700">
                <Award className="w-3.5 h-3.5 text-indigo-400" /> Featured Spotlight
              </div>

              {heroFeaturedApp ? (
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <img
                      src={heroFeaturedApp.icon}
                      alt={heroFeaturedApp.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/30 shadow-lg"
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-white">{heroFeaturedApp.name}</h2>
                      <p className="text-xs text-slate-400">{heroFeaturedApp.developerName} • v{heroFeaturedApp.version}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 font-normal line-clamp-2 leading-relaxed max-w-md">
                    {heroFeaturedApp.shortDescription}
                  </p>
                </div>
              ) : (
                <div>
                  <h1 className="text-3xl font-bold text-white leading-tight">
                    Discover Verified <br /> Android Applications
                  </h1>
                  <p className="text-sm text-slate-400 mt-2">
                    {settings.bannerText || 'Fast, direct, and virus-free APK downloads curated for power users.'}
                  </p>
                </div>
              )}
            </div>

            {/* Hero Search or Action Box */}
            <div className="relative z-10 mt-6 space-y-4">
              <form onSubmit={handleHeroSearch} className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                <Search className="w-4 h-4 text-slate-500 ml-3" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Search app name or developer..."
                  className="w-full bg-transparent border-none px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-semibold text-xs transition shadow-md whitespace-nowrap"
                >
                  Search
                </button>
              </form>

              {heroFeaturedApp && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => downloadApp(heroFeaturedApp)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl px-5 py-2.5 text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition"
                  >
                    <Download className="w-4 h-4" /> Download APK ({heroFeaturedApp.sizeMb}MB)
                  </button>
                  <Link
                    to={`/app/${heroFeaturedApp.id}`}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl px-4 py-2.5 text-xs transition border border-slate-700"
                  >
                    View Details
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Bento Card 2: Role / Action Portal Bento */}
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Portal Overview</span>
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
              </div>
              <h3 className="text-base font-bold text-white">
                {currentRole === 'admin' ? 'App Moderation Queue' : currentRole === 'developer' ? 'Developer Studio' : 'Verified Repository'}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {currentRole === 'admin'
                  ? `${pendingApps.length} applications waiting for security approval.`
                  : currentRole === 'developer'
                  ? 'Submit your APK builds to reach global Android users.'
                  : 'Scan every build with high-grade security automated tools.'}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800">
              {currentRole === 'admin' ? (
                <Link
                  to="/admin/moderation"
                  className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition shadow-md"
                >
                  Inspect Queue ({pendingApps.length}) <ChevronRight className="w-4 h-4" />
                </Link>
              ) : currentRole === 'developer' ? (
                <Link
                  to="/dev/publish"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition shadow-md"
                >
                  + Submit APK <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Virus & Malware Free</span>
                </div>
              )}
            </div>
          </div>

          {/* Bento Card 3: Global Platform Stats */}
          <div className="bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-800 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-500 text-[10px] font-semibold uppercase tracking-wider mb-2">
                <span>System Metrics</span>
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <p className="text-3xl font-extrabold text-white">1.5M+</p>
              <p className="text-xs text-slate-400 mt-0.5">Direct APK Downloads</p>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>CDN Mirror Speed</span>
                  <span className="text-indigo-400 font-semibold">10 Gbps</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-indigo-500 h-full rounded-full w-4/5"></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-2">
                <span>Active Apps: <strong className="text-white">{approvedApps.length}</strong></span>
                <span>Security Scans: <strong className="text-emerald-400">Passing</strong></span>
              </div>
            </div>
          </div>

          {/* Bento Card 4: Categories Grid */}
          <div className="md:col-span-2 bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-indigo-400" /> Browse Top Categories
                </h3>
                <Link to="/browse" className="text-xs text-indigo-400 hover:underline flex items-center gap-0.5">
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => navigate(`/browse?category=${encodeURIComponent(cat.name)}`)}
                    className="p-2.5 rounded-2xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white text-center transition"
                  >
                    <span className="text-lg block mb-0.5">{cat.icon}</span>
                    <span className="text-xs font-semibold block">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bento Card 5: Top Rated Quick Preview */}
          <div className="md:col-span-2 bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" /> Top Rated Applications
              </h3>
              <Link to="/browse?sort=rating" className="text-xs text-indigo-400 hover:underline">
                Explore More
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {approvedApps.slice(0, 2).map((app) => (
                <div key={app.id} className="bg-slate-950 border border-slate-800 p-3 rounded-2xl flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={app.icon} alt={app.name} className="w-10 h-10 rounded-xl object-cover border border-slate-800 flex-shrink-0" />
                    <div className="min-w-0">
                      <Link to={`/app/${app.id}`} className="text-xs font-bold text-white hover:text-indigo-400 truncate block">
                        {app.name}
                      </Link>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {app.avgRating} • {app.sizeMb}MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => downloadApp(app)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-3 py-1.5 text-[11px] font-semibold flex-shrink-0"
                  >
                    Get
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bento Developer Callout Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-indigo-400 text-[10px] font-semibold uppercase tracking-wider mb-2 border border-slate-700">
              <Code className="w-3.5 h-3.5 text-indigo-400" /> For Mobile Developers
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Publish Your Android Application Today</h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Free distribution platform for verified Android APKs. Direct CDN links, zero bandwidth limits, and instant moderation workflow.
            </p>
          </div>
          <Link
            to="/dev/publish"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition whitespace-nowrap"
          >
            Submit Application
          </Link>
        </div>

        {/* Trending Downloads List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" /> Trending Downloads
              </h2>
              <p className="text-xs text-slate-400">Most downloaded applications this week</p>
            </div>
            <Link to="/browse?sort=popular" className="text-xs text-indigo-400 hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingApps.map((app) => (
              <AppCard key={app.id} app={app} onDownload={() => downloadApp(app)} />
            ))}
          </div>
        </section>

        {/* New Releases Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-400" /> Fresh Releases & Updates
              </h2>
              <p className="text-xs text-slate-400">Recently published APK builds</p>
            </div>
            <Link to="/browse?sort=newest" className="text-xs text-indigo-400 hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {newReleases.map((app) => (
              <AppCard key={app.id} app={app} onDownload={() => downloadApp(app)} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// Reusable App Card Component in Dark Slate Theme
const AppCard: React.FC<{ app: AppItem; onDownload: () => void }> = ({ app, onDownload }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl flex items-center justify-between gap-3 group transition shadow-lg">
      <Link to={`/app/${app.id}`} className="flex items-center gap-3 min-w-0 flex-1">
        <img
          src={app.icon}
          alt={app.name}
          className="w-13 h-13 rounded-xl object-cover border border-slate-800 group-hover:scale-105 transition-transform flex-shrink-0"
        />
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-white truncate group-hover:text-indigo-400 transition">
            {app.name}
          </h4>
          <p className="text-xs text-slate-400 truncate">{app.developerName}</p>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-medium">
            <span className="flex items-center text-amber-400 font-semibold">
              <Star className="w-3 h-3 fill-amber-400 mr-0.5 text-amber-400" /> {app.avgRating || 'N/A'}
            </span>
            <span>•</span>
            <span>{app.sizeMb} MB</span>
            <span>•</span>
            <span className="text-slate-500">{app.category}</span>
          </div>
        </div>
      </Link>

      <button
        onClick={onDownload}
        className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl transition flex-shrink-0 font-semibold shadow-md"
        title="Download APK"
      >
        <Download className="w-4 h-4" />
      </button>
    </div>
  );
};
