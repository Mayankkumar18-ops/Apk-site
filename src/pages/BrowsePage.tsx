import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Download,
  Star,
  Search,
  Grid as GridIcon,
  List as ListIcon,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppCategory, AppItem } from '../types';

const CATEGORIES: (AppCategory | 'All')[] = [
  'All',
  'Games',
  'Tools',
  'Social',
  'Productivity',
  'Media',
  'Education',
  'Personalization',
  'Finance',
];

export const BrowsePage: React.FC = () => {
  const { apps, downloadApp } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search param initialization
  const categoryParam = (searchParams.get('category') as AppCategory) || 'All';
  const sortParam = searchParams.get('sort') || 'popular';

  const [selectedCategory, setSelectedCategory] = useState<AppCategory | 'All'>(categoryParam);
  const [sortBy, setSortBy] = useState<string>(sortParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxSize, setMaxSize] = useState<number>(1000); // MB
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Keep state synchronized with URL search parameters (e.g. category links from Header / Footer)
  useEffect(() => {
    const currentCategory = (searchParams.get('category') as AppCategory) || 'All';
    const currentSort = searchParams.get('sort') || 'popular';
    setSelectedCategory(currentCategory);
    setSortBy(currentSort);
  }, [searchParams]);

  // Filter approved apps
  const approvedApps = useMemo(() => apps.filter((a) => a.status === 'Approved'), [apps]);

  // Apply live filtering and sorting
  const filteredApps = useMemo(() => {
    return approvedApps
      .filter((app) => {
        const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
        const matchesSearch =
          !searchQuery.trim() ||
          app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.developerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRating = app.avgRating >= minRating;
        const matchesSize = app.sizeMb <= maxSize;

        return matchesCategory && matchesSearch && matchesRating && matchesSize;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return (b.downloadCount || 0) - (a.downloadCount || 0);
        if (sortBy === 'newest') return new Date(b.createdDate || 0).getTime() - new Date(a.createdDate || 0).getTime();
        if (sortBy === 'rating') return b.avgRating - a.avgRating;
        if (sortBy === 'size') return a.sizeMb - b.sizeMb;
        return 0;
      });
  }, [approvedApps, selectedCategory, searchQuery, minRating, maxSize, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSortBy('popular');
    setSearchQuery('');
    setMinRating(0);
    setMaxSize(1000);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Title & Breadcrumb */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Browse Applications</h1>
            <p className="text-xs text-slate-400 mt-1">
              Explore {filteredApps.length} verified Android APKs across all categories
            </p>
          </div>

          {/* View Toggle & Search Input */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter apps..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <GridIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'list' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
                title="List View"
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSearchParams(cat === 'All' ? {} : { category: cat });
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 flex items-center gap-1 font-medium">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-white font-medium rounded-lg px-2.5 py-1 focus:outline-none"
              >
                <option value="popular">Most Downloads</option>
                <option value="newest">Newest Releases</option>
                <option value="rating">Highest Rated</option>
                <option value="size">Smallest Size</option>
              </select>
            </div>

            {/* Min Rating Filter */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Min Rating:</span>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 text-white font-medium rounded-lg px-2.5 py-1 focus:outline-none"
              >
                <option value={0}>Any Rating</option>
                <option value={4.0}>★ 4.0 & Up</option>
                <option value={4.5}>★ 4.5 & Up</option>
              </select>
            </div>

            {/* Max Size Filter */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Max Size:</span>
              <select
                value={maxSize}
                onChange={(e) => setMaxSize(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 text-white font-medium rounded-lg px-2.5 py-1 focus:outline-none"
              >
                <option value={1000}>Any Size</option>
                <option value={50}>Under 50MB</option>
                <option value={200}>Under 200MB</option>
              </select>
            </div>
          </div>

          <button
            onClick={resetFilters}
            className="text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>

        {/* Applications List Grid */}
        {filteredApps.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <p className="text-white font-bold text-lg">No applications found</p>
            <p className="text-xs text-slate-400">Try adjusting your category or filter selections.</p>
            <button
              onClick={resetFilters}
              className="mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition"
            >
              Clear Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredApps.map((app) => (
              <AppGridCard key={app.id} app={app} onDownload={() => downloadApp(app)} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredApps.map((app) => (
              <AppListCard key={app.id} app={app} onDownload={() => downloadApp(app)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AppGridCard: React.FC<{ app: AppItem; onDownload: () => void }> = ({ app, onDownload }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl flex flex-col justify-between space-y-3 group transition shadow-lg">
      <div className="flex items-start gap-3">
        <img
          src={app.icon}
          alt={app.name}
          className="w-14 h-14 rounded-2xl object-cover border border-slate-800 group-hover:scale-105 transition-transform flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <Link to={`/app/${app.id}`} className="text-sm font-bold text-white hover:text-indigo-400 truncate block">
            {app.name}
          </Link>
          <p className="text-xs text-slate-400 truncate">{app.developerName}</p>
          <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800">
            {app.category}
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-400 font-normal line-clamp-2 leading-relaxed">
        {app.shortDescription}
      </p>

      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="flex items-center text-amber-400 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" /> {app.avgRating}
          </span>
          <span>•</span>
          <span>{app.sizeMb}MB</span>
        </div>

        <button
          onClick={onDownload}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl transition flex items-center gap-1 shadow-md"
        >
          <Download className="w-3.5 h-3.5" /> Get
        </button>
      </div>
    </div>
  );
};

const AppListCard: React.FC<{ app: AppItem; onDownload: () => void }> = ({ app, onDownload }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl flex items-center justify-between gap-4 group transition shadow-lg">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <img
          src={app.icon}
          alt={app.name}
          className="w-12 h-12 rounded-xl object-cover border border-slate-800 flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Link to={`/app/${app.id}`} className="text-sm font-bold text-white hover:text-indigo-400 truncate">
              {app.name}
            </Link>
            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-slate-950 text-slate-300 border border-slate-800">
              {app.category}
            </span>
          </div>
          <p className="text-xs text-slate-400 truncate">{app.developerName} • {app.shortDescription}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="hidden sm:block text-right text-xs text-slate-400 font-medium">
          <p className="text-amber-400 font-semibold flex items-center justify-end gap-0.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {app.avgRating}
          </p>
          <p>{app.sizeMb} MB</p>
        </div>

        <button
          onClick={onDownload}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md"
        >
          <Download className="w-4 h-4" /> Download
        </button>
      </div>
    </div>
  );
};
