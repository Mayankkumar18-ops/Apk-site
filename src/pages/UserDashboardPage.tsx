import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Download,
  Bookmark,
  MessageSquare,
  Calendar,
  Trash2,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const UserDashboardPage: React.FC = () => {
  const { currentUser, apps, reviews, downloadApp, toggleFavorite, updateUserProfile } = useApp();
  const [activeTab, setActiveTab] = useState<'downloads' | 'favorites' | 'reviews' | 'profile'>('downloads');

  // Edit Profile state
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');

  if (!currentUser) return null;

  const downloadedIds: string[] = 'downloadedAppIds' in currentUser ? currentUser.downloadedAppIds || [] : [];
  const favoriteIds: string[] = 'favorites' in currentUser ? currentUser.favorites || [] : [];

  const downloadedApps = apps.filter((a) => downloadedIds.includes(a.id));
  const favoriteApps = apps.filter((a) => favoriteIds.includes(a.id));
  const myReviews = reviews.filter((r) => r.userId === currentUser.id);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name: editName, email: editEmail });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Profile Summary Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500"
            />
            <div>
              <h1 className="text-xl font-bold text-white">{currentUser.name}</h1>
              <p className="text-xs text-slate-400">{currentUser.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Standard Member
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Member since {('joinedDate' in currentUser && currentUser.joinedDate) || '2025'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-center sm:text-right border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-800 w-full sm:w-auto justify-around sm:justify-end">
            <div>
              <p className="text-xl font-bold text-white">{downloadedApps.length}</p>
              <p className="text-[10px] text-slate-400">Downloads</p>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div>
              <p className="text-xl font-bold text-white">{favoriteApps.length}</p>
              <p className="text-[10px] text-slate-400">Favorites</p>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div>
              <p className="text-xl font-bold text-white">{myReviews.length}</p>
              <p className="text-[10px] text-slate-400">Reviews</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('downloads')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === 'downloads'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Download className="w-4 h-4" /> Download History ({downloadedApps.length})
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === 'favorites'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Bookmark className="w-4 h-4" /> Bookmarks ({favoriteApps.length})
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === 'reviews'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> My Reviews ({myReviews.length})
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <User className="w-4 h-4" /> Settings
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'downloads' && (
          <div className="space-y-4">
            {downloadedApps.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
                <Download className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-white">No downloads recorded yet</h3>
                <p className="text-xs text-slate-400 mt-1">Download APKs from the store to keep track of your installed versions.</p>
                <Link to="/browse" className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold">
                  Explore APKs
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {downloadedApps.map((app) => (
                  <div key={app.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={app.icon} alt={app.name} className="w-12 h-12 rounded-xl object-cover border border-slate-800" />
                      <div className="min-w-0">
                        <Link to={`/app/${app.id}`}>
                          <h4 className="text-sm font-bold text-white truncate hover:text-indigo-400">{app.name}</h4>
                        </Link>
                        <p className="text-xs text-slate-400">v{app.version} • {app.sizeMb}MB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => downloadApp(app)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Re-Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="space-y-4">
            {favoriteApps.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
                <Bookmark className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-white">No saved favorite apps</h3>
                <p className="text-xs text-slate-400 mt-1">Click the bookmark icon on any app details page to save it here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favoriteApps.map((app) => (
                  <div key={app.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={app.icon} alt={app.name} className="w-12 h-12 rounded-xl object-cover border border-slate-800" />
                      <div className="min-w-0">
                        <Link to={`/app/${app.id}`}>
                          <h4 className="text-sm font-bold text-white truncate hover:text-indigo-400">{app.name}</h4>
                        </Link>
                        <p className="text-xs text-slate-400">★ {app.avgRating} • {app.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFavorite(app.id)}
                        className="text-slate-500 hover:text-rose-400 p-1.5"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => downloadApp(app)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold"
                      >
                        APK
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-3">
            {myReviews.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
                <MessageSquare className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-white">You haven't reviewed any apps yet</h3>
                <p className="text-xs text-slate-400 mt-1">Share feedback on apps you've tested to help the community.</p>
              </div>
            ) : (
              myReviews.map((rev) => {
                const reviewedApp = apps.find((a) => a.id === rev.appId);
                return (
                  <div key={rev.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <Link to={`/app/${rev.appId}`} className="text-xs font-bold text-indigo-400 hover:underline">
                        {reviewedApp ? reviewedApp.name : 'Reviewed Application'}
                      </Link>
                      <span className="text-[10px] text-slate-500">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                      {'★'.repeat(rev.rating)}
                    </div>
                    <p className="text-xs text-slate-300 font-medium">{rev.comment}</p>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-lg">
            <h2 className="text-sm font-bold text-white mb-4">Edit Profile Settings</h2>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Save Profile Changes
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
