import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Download, Star, PackageSearch } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SearchResultsPage: React.FC = () => {
  const { apps, downloadApp } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);

  const approvedApps = apps.filter((a) => a.status === 'Approved');

  const searchResults = approvedApps.filter((app) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      app.name.toLowerCase().includes(q) ||
      app.developerName.toLowerCase().includes(q) ||
      app.packageName.toLowerCase().includes(q) ||
      app.category.toLowerCase().includes(q) ||
      app.description.toLowerCase().includes(q)
    );
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Search Bar Banner */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search APKs by title, developer, or package..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition"
            >
              Search
            </button>
          </form>

          {query && (
            <p className="text-xs text-slate-400 mt-3 font-medium">
              Showing results for <span className="text-indigo-400 font-bold">"{query}"</span> ({searchResults.length} found)
            </p>
          )}
        </div>

        {/* Results Grid */}
        {searchResults.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center space-y-3">
            <PackageSearch className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No applications match your search</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Try searching with different keywords or browse all applications by category.
            </p>
            <Link
              to="/browse"
              className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-bold"
            >
              Browse All Store Apps
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.map((app) => (
              <div
                key={app.id}
                className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4 shadow-sm hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img src={app.icon} alt={app.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-800 shrink-0" />
                  <div className="min-w-0">
                    <Link to={`/app/${app.id}`}>
                      <h3 className="text-sm font-bold text-white truncate hover:text-indigo-400">{app.name}</h3>
                    </Link>
                    <p className="text-xs text-slate-400 truncate">{app.developerName} • {app.category}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px]">
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {app.avgRating}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400 font-medium">{app.downloadCount.toLocaleString()} downloads</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => downloadApp(app)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-md transition"
                >
                  <Download className="w-3.5 h-3.5" /> APK
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
