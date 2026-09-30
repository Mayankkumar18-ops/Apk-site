import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  ArrowLeft,
  X,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppItem } from '../types';

export const AppModerationPage: React.FC = () => {
  const { apps, approveApp, rejectApp, currentRole, showToast } = useApp();
  const navigate = useNavigate();

  const [previewApp, setPreviewApp] = useState<AppItem | null>(null);
  const [rejectingApp, setRejectingApp] = useState<AppItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  if (currentRole !== 'admin') return null;

  const pendingApps = apps.filter((a) => a.status === 'Pending');

  const handleApprove = (app: AppItem) => {
    approveApp(app.id);
    if (previewApp?.id === app.id) setPreviewApp(null);
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      showToast('Please provide a reason for rejecting this app submission', 'error');
      return;
    }
    if (rejectingApp) {
      rejectApp(rejectingApp.id, rejectReason);
      setRejectingApp(null);
      setRejectReason('');
      if (previewApp?.id === rejectingApp.id) setPreviewApp(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-1 font-bold transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Admin Console
        </button>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-xl">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-6 h-6 text-amber-400" /> Store Moderation Queue
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Review developer APK submissions before approving them for public store display.
            </p>
          </div>
          <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold px-3 py-1 rounded-xl text-xs flex items-center gap-1.5">
            <Clock className="w-4 h-4 animate-spin" /> {pendingApps.length} Pending
          </span>
        </div>

        {pendingApps.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">All Submissions Reviewed!</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              There are currently no pending APK submissions waiting in the moderation queue.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingApps.map((app) => (
              <div
                key={app.id}
                className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <img
                    src={app.icon}
                    alt={app.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-800 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-white truncate">{app.name}</h3>
                      <span className="text-xs font-mono text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        v{app.version}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {app.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1 font-medium">
                      Publisher: <span className="text-white font-bold">{app.developerName}</span> • Package: <span className="font-mono text-slate-400">{app.packageName}</span>
                    </p>

                    <p className="text-xs text-slate-300 mt-2 line-clamp-2">{app.description}</p>

                    <div className="flex items-center gap-4 mt-3 text-[11px] text-slate-400 font-medium">
                      <span>Size: {app.sizeMb} MB</span>
                      <span>•</span>
                      <span>Target Android: {app.minAndroidVersion || '7.0+'}</span>
                      <span>•</span>
                      <span>Submitted: {app.createdDate}</span>
                    </div>
                  </div>
                </div>

                {/* Moderation Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => setPreviewApp(app)}
                    className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Eye className="w-4 h-4 text-indigo-400" /> Inspect
                  </button>

                  <button
                    onClick={() => setRejectingApp(app)}
                    className="px-3.5 py-2 bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>

                  <button
                    onClick={() => handleApprove(app)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve & Publish
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inspect Modal */}
      {previewApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-400" /> Full Package Audit: {previewApp.name}
              </h3>
              <button
                onClick={() => setPreviewApp(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <img src={previewApp.icon} alt={previewApp.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-800" />
              <div>
                <h4 className="text-lg font-bold text-white">{previewApp.name}</h4>
                <p className="text-xs text-slate-400">{previewApp.developerName} • {previewApp.packageName}</p>
                <span className="inline-block mt-1 text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  v{previewApp.version} ({previewApp.sizeMb} MB)
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-300">Application Description</p>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                {previewApp.description}
              </div>
            </div>

            {previewApp.screenshots && previewApp.screenshots.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-300">App Screenshots</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {previewApp.screenshots.map((s, idx) => (
                    <img key={idx} src={s} alt="screen" className="h-28 w-auto rounded-lg object-cover border border-slate-800" />
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setRejectingApp(previewApp);
                  setPreviewApp(null);
                }}
                className="px-4 py-2 bg-rose-600/10 text-rose-400 hover:bg-rose-600/20 border border-rose-500/20 rounded-xl text-xs font-bold"
              >
                Reject Application
              </button>
              <button
                onClick={() => handleApprove(previewApp)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Approve for Public Release
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectingApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" /> Reject Application Submission
              </h3>
              <button
                onClick={() => setRejectingApp(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Provide feedback to <span className="font-bold text-white">{rejectingApp.developerName}</span> explaining why <span className="font-bold text-white">{rejectingApp.name}</span> was rejected.
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Incomplete description, placeholder icons detected, or invalid APK package hash..."
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
                required
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setRejectingApp(null)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
