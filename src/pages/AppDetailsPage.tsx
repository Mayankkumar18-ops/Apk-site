import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Download,
  Star,
  ShieldCheck,
  Calendar,
  Layers,
  Bookmark,
  BookmarkCheck,
  Share2,
  Lock,
  MessageSquare,
  ThumbsUp,
  User,
  AlertTriangle,
  ChevronRight,
  Maximize2,
  X,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppItem } from '../types';

export const AppDetailsPage: React.FC = () => {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const { apps, reviews, currentUser, currentRole, downloadApp, addReview, toggleFavorite, showToast } = useApp();

  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);
  const [userRating, setUserRating] = useState<number>(5);
  const [userComment, setUserComment] = useState<string>('');
  const [showFullDescription, setShowFullDescription] = useState(false);

  const app = apps.find((a) => a.id === appId);

  if (!app) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">Application Not Found</h2>
          <p className="text-xs text-slate-400 mt-2">
            The application you are looking for may have been removed or is pending approval.
          </p>
          <button
            onClick={() => navigate('/browse')}
            className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-semibold"
          >
            Browse All Apps
          </button>
        </div>
      </div>
    );
  }

  const appReviews = reviews.filter((r) => r.appId === app.id);
  const similarApps = apps
    .filter((a) => a.id !== app.id && a.category === app.category && a.status === 'Approved')
    .slice(0, 3);

  const isFavorite = currentUser && 'favorites' in currentUser && currentUser.favorites?.includes(app.id);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) {
      showToast('Please enter a review comment', 'error');
      return;
    }
    addReview(app.id, userRating, userComment);
    setUserComment('');
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Share link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-[#FFFDCE] text-[#2D1E2F] pb-16">
      {/* Top Banner Header */}
      <div className="bg-[#F7DB91] border-b border-[#E2C87A] py-10 px-4 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              <img
                src={app.icon}
                alt={app.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-[#F075AE] shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FFFDCE] text-[#F075AE] border border-[#E2C87A]">
                    {app.category}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FFFDCE] text-[#9BC264] border border-[#E2C87A] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#9BC264]" /> Virus Free
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-[#2D1E2F] mt-2 tracking-tight">{app.name}</h1>
                <p className="text-xs text-[#2D1E2F]/80 font-medium">
                  Developed by <span className="text-[#2D1E2F] font-bold">{app.developerName}</span> • v{app.version}
                </p>

                <div className="flex items-center gap-4 mt-3 text-xs text-[#2D1E2F]/80 font-medium">
                  <div className="flex items-center gap-1 text-amber-800 font-bold">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> {app.avgRating}
                    <span className="text-[#2D1E2F]/60 font-normal">({app.ratingCount} ratings)</span>
                  </div>
                  <span>•</span>
                  <span>{app.downloadCount.toLocaleString()} downloads</span>
                  <span>•</span>
                  <span>{app.sizeMb} MB</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => downloadApp(app)}
                className="bg-[#F075AE] hover:bg-[#d85891] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> Download APK ({app.sizeMb}MB)
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFavorite(app.id)}
                  className={`p-3 rounded-2xl border transition ${
                    isFavorite
                      ? 'bg-[#FFFDCE] text-[#F075AE] border-[#F075AE]'
                      : 'bg-[#FFFDCE] text-[#2D1E2F] border-[#E2C87A] hover:bg-[#F7DB91]'
                  }`}
                  title="Save to Favorites"
                >
                  {isFavorite ? <BookmarkCheck className="w-5 h-5 text-[#F075AE]" /> : <Bookmark className="w-5 h-5" />}
                </button>

                <button
                  onClick={copyShareLink}
                  className="p-3 bg-[#FFFDCE] hover:bg-[#F7DB91] text-[#2D1E2F] border border-[#E2C87A] rounded-2xl transition"
                  title="Share App"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-12">
        {/* Screenshots Gallery */}
        {app.screenshots && app.screenshots.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-[#2D1E2F] mb-4">Screenshots</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {app.screenshots.map((shot, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveScreenshot(shot)}
                  className="relative group cursor-pointer overflow-hidden rounded-3xl border border-[#E2C87A] bg-[#FFFDCE] shadow-2xs"
                >
                  <img
                    src={shot}
                    alt={`${app.name} screenshot ${idx + 1}`}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-[#2D1E2F]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 className="w-6 h-6 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Description & Metadata Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Description */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-[#F7DB91] border border-[#E2C87A] p-6 rounded-3xl shadow-2xs">
              <h2 className="text-lg font-bold text-[#2D1E2F] mb-3">About this App</h2>
              <p
                className={`text-sm text-[#2D1E2F]/90 leading-relaxed font-medium ${
                  !showFullDescription ? 'line-clamp-4' : ''
                }`}
              >
                {app.description}
              </p>

              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="mt-3 text-xs font-bold text-[#F075AE] hover:underline flex items-center gap-1"
              >
                {showFullDescription ? 'Show Less' : 'Read Full Description'}
              </button>
            </section>

            {/* Requested Permissions */}
            <section className="bg-[#F7DB91] border border-[#E2C87A] p-6 rounded-3xl shadow-2xs">
              <h2 className="text-lg font-bold text-[#2D1E2F] mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#F075AE]" /> App Permissions
              </h2>
              <div className="flex flex-wrap gap-2">
                {(app.permissions || []).map((perm) => (
                  <span
                    key={perm}
                    className="text-xs bg-[#FFFDCE] border border-[#E2C87A] text-[#2D1E2F] font-bold px-3 py-1.5 rounded-xl"
                  >
                    {perm}
                  </span>
                ))}
              </div>
            </section>

            {/* Ratings & Reviews Section */}
            <section className="bg-[#F7DB91] border border-[#E2C87A] p-6 rounded-3xl space-y-6 shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#E2C87A]/60 pb-4">
                <h2 className="text-lg font-bold text-[#2D1E2F] flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-700" /> User Reviews & Ratings
                </h2>
                <div className="text-xs text-[#2D1E2F]/80 font-medium">
                  <span className="text-amber-800 font-bold text-sm mr-1">★ {app.avgRating}</span> out of 5
                </div>
              </div>

              {/* Submit Review Form */}
              {currentRole !== 'guest' ? (
                <form onSubmit={handleReviewSubmit} className="bg-[#FFFDCE] p-4 rounded-2xl border border-[#E2C87A] space-y-3">
                  <h3 className="text-xs font-bold text-[#2D1E2F]">Rate & Write a Review</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#2D1E2F]/80">Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setUserRating(s)}
                          className={`text-lg transition ${s <= userRating ? 'text-amber-500' : 'text-[#2D1E2F]/30'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    placeholder="Share your experience with this application..."
                    rows={3}
                    className="w-full bg-[#FFFDCE] border border-[#E2C87A] rounded-xl p-2.5 text-xs text-[#2D1E2F] placeholder-[#2D1E2F]/50 focus:outline-none focus:border-[#F075AE]"
                  />

                  <button
                    type="submit"
                    className="bg-[#F075AE] hover:bg-[#d85891] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition"
                  >
                    Submit Review
                  </button>
                </form>
              ) : (
                <div className="bg-[#FFFDCE] p-4 rounded-2xl border border-[#E2C87A] text-center text-xs text-[#2D1E2F]/80">
                  Please <Link to="/user/login" className="text-[#F075AE] font-bold underline">log in</Link> to post a rating or review.
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {appReviews.length === 0 ? (
                  <p className="text-xs text-[#2D1E2F]/60 text-center py-4">No reviews yet. Be the first to review this application!</p>
                ) : (
                  appReviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-[#FFFDCE] border border-[#E2C87A] rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                            alt={rev.userName}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span className="text-xs font-bold text-[#2D1E2F]">{rev.userName}</span>
                        </div>
                        <span className="text-[10px] text-[#2D1E2F]/60">{rev.date}</span>
                      </div>

                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        {'★'.repeat(rev.rating)}
                        {'☆'.repeat(5 - rev.rating)}
                      </div>

                      <p className="text-xs text-[#2D1E2F] font-medium">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Metadata */}
          <div className="space-y-6">
            <div className="bg-[#F7DB91] border border-[#E2C87A] p-6 rounded-3xl space-y-4 text-xs shadow-2xs">
              <h3 className="text-sm font-bold text-[#2D1E2F] border-b border-[#E2C87A]/60 pb-2">Technical Info</h3>

              <div className="flex justify-between">
                <span className="text-[#2D1E2F]/80">Package Name</span>
                <span className="text-[#2D1E2F] font-mono text-[11px] font-bold">{app.packageName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#2D1E2F]/80">Version</span>
                <span className="text-[#2D1E2F] font-semibold">{app.version}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#2D1E2F]/80">File Size</span>
                <span className="text-[#2D1E2F] font-semibold">{app.sizeMb} MB</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#2D1E2F]/80">Updated</span>
                <span className="text-[#2D1E2F] font-semibold">{app.updatedDate}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#2D1E2F]/80">Requires Android</span>
                <span className="text-[#2D1E2F] font-semibold">8.0 and up</span>
              </div>
            </div>

            {/* Similar Apps Carousel */}
            {similarApps.length > 0 && (
              <div className="bg-[#F7DB91] border border-[#E2C87A] p-6 rounded-3xl space-y-4 shadow-2xs">
                <h3 className="text-sm font-bold text-[#2D1E2F] flex items-center justify-between">
                  <span>Similar Apps</span>
                  <Link to={`/browse?category=${app.category}`} className="text-xs text-[#F075AE] font-bold hover:underline">
                    More
                  </Link>
                </h3>

                <div className="space-y-3">
                  {similarApps.map((sApp) => (
                    <Link
                      key={sApp.id}
                      to={`/app/${sApp.id}`}
                      className="flex items-center gap-3 p-2 rounded-2xl bg-[#FFFDCE] hover:bg-[#E2C87A]/40 transition border border-[#E2C87A]"
                    >
                      <img src={sApp.icon} alt={sApp.name} className="w-10 h-10 rounded-xl object-cover border border-[#E2C87A]" />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-[#2D1E2F] truncate">{sApp.name}</h4>
                        <p className="text-[10px] text-[#2D1E2F]/80 truncate font-medium">★ {sApp.avgRating} • {sApp.sizeMb}MB</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Zooming Screenshots */}
      {activeScreenshot && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setActiveScreenshot(null)}
              className="absolute -top-10 right-0 text-white hover:text-slate-300"
            >
              <X className="w-8 h-8" />
            </button>
            <img src={activeScreenshot} alt="Enlarged screenshot" className="max-w-full max-h-[85vh] rounded-xl object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};
