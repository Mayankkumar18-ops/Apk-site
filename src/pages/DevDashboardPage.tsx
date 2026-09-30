import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Code,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Star,
  Edit,
  Trash2,
  AlertCircle,
  Building,
  RefreshCcw,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DeveloperProfile } from '../types';

export const DevDashboardPage: React.FC = () => {
  const { currentUser, currentRole, apps, deleteApp, updateDevProfile } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'apps' | 'profile'>('apps');

  // Profile Edit State
  const devProfile = currentUser as DeveloperProfile;
  const [bio, setBio] = useState(devProfile?.bio || '');
  const [company, setCompany] = useState(devProfile?.company || '');
  const [website, setWebsite] = useState(devProfile?.website || '');

  if (currentRole !== 'developer' || !devProfile) return null;

  // Filter apps owned by this developer
  const myApps = apps.filter(
    (a) => a.developerId === devProfile.id || a.developerName.toLowerCase() === devProfile.name.toLowerCase()
  );

  const approvedApps = myApps.filter((a) => a.status === 'Approved');
  const pendingApps = myApps.filter((a) => a.status === 'Pending');
  const rejectedApps = myApps.filter((a) => a.status === 'Rejected');

  const totalDownloads = myApps.reduce((sum, a) => sum + a.downloadCount, 0);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateDevProfile({ bio, company, website });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header & Action */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <img
              src={devProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={devProfile.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{devProfile.name}</h1>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Verified Developer
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{devProfile.company} • {devProfile.email}</p>
            </div>
          </div>

          <Link
            to="/dev/publish"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition w-full md:w-auto justify-center"
          >
            <PlusCircle className="w-4 h-4" /> Publish New Application
          </Link>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <p className="text-2xl font-extrabold text-white">{myApps.length}</p>
            <p className="text-xs text-slate-400 mt-1">Total Submitted</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <p className="text-2xl font-extrabold text-emerald-400">{approvedApps.length}</p>
            <p className="text-xs text-slate-400 mt-1">Live Approved</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <p className="text-2xl font-extrabold text-amber-400">{pendingApps.length}</p>
            <p className="text-xs text-slate-400 mt-1">Pending Review</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <p className="text-2xl font-extrabold text-rose-400">{rejectedApps.length}</p>
            <p className="text-xs text-slate-400 mt-1">Needs Revision</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl col-span-2 md:col-span-1">
            <p className="text-2xl font-extrabold text-indigo-400">{totalDownloads.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">Total Downloads</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('apps')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === 'apps' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Code className="w-4 h-4" /> My Applications ({myApps.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Building className="w-4 h-4" /> Developer Settings
          </button>
        </div>

        {/* My Submitted Apps Table */}
        {activeTab === 'apps' && (
          <div className="space-y-4">
            {myApps.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                <Code className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No applications published yet</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Submit your Android APK package to start distributing to our global user base.
                </p>
                <Link
                  to="/dev/publish"
                  className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-bold"
                >
                  Publish First APK
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myApps.map((app) => (
                  <div
                    key={app.id}
                    className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <img src={app.icon} alt={app.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-800" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-white truncate">{app.name}</h3>
                            <span className="text-[10px] font-mono text-slate-400">v{app.version}</span>
                          </div>
                          <p className="text-xs text-slate-400 truncate">{app.packageName} • {app.category}</p>
                          <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400 font-medium">
                            <span>{app.downloadCount.toLocaleString()} downloads</span>
                            <span>•</span>
                            <span className="flex items-center text-amber-400 font-bold">★ {app.avgRating}</span>
                            <span>•</span>
                            <span>Updated: {app.updatedDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge & Actions */}
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        {app.status === 'Approved' && (
                          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                          </span>
                        )}

                        {app.status === 'Pending' && (
                          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
                            <Clock className="w-3.5 h-3.5 animate-spin" /> Pending Review
                          </span>
                        )}

                        {app.status === 'Rejected' && (
                          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-semibold border border-rose-500/20">
                            <XCircle className="w-3.5 h-3.5" /> Rejected
                          </span>
                        )}

                        <div className="flex items-center gap-1 border-l border-slate-800 pl-3">
                          <button
                            onClick={() => navigate(`/dev/publish?editId=${app.id}`)}
                            className="p-2 text-slate-300 hover:text-indigo-400 bg-slate-950 rounded-lg border border-slate-800"
                            title="Edit / Resubmit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteApp(app.id)}
                            className="p-2 text-slate-300 hover:text-rose-400 bg-slate-950 rounded-lg border border-slate-800"
                            title="Delete App"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Rejection Reason Notice Box */}
                    {app.status === 'Rejected' && app.rejectionReason && (
                      <div className="bg-rose-950/40 border border-rose-800/60 p-3.5 rounded-xl text-xs space-y-1.5">
                        <div className="flex items-center gap-1.5 font-bold text-rose-300">
                          <AlertCircle className="w-4 h-4" /> Admin Moderation Feedback:
                        </div>
                        <p className="text-slate-300 font-medium">{app.rejectionReason}</p>
                        <button
                          onClick={() => navigate(`/dev/publish?editId=${app.id}`)}
                          className="mt-2 inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white px-3 py-1 rounded-lg font-semibold text-[11px]"
                        >
                          <RefreshCcw className="w-3 h-3" /> Edit App Details & Resubmit for Review
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Developer Profile Settings Tab */}
        {activeTab === 'profile' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-xl">
            <h2 className="text-sm font-bold text-white mb-4">Developer Profile</h2>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Company / Studio Name</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Website URL</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Developer Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Save Profile Details
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
