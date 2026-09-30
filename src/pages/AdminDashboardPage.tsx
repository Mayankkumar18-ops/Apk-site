import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  CheckSquare,
  Users,
  Settings,
  Download,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminDashboardPage: React.FC = () => {
  const { apps, developers, deleteApp, currentRole } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  if (currentRole !== 'admin') return null;

  const pendingApps = apps.filter((a) => a.status === 'Pending');
  const approvedApps = apps.filter((a) => a.status === 'Approved');
  const rejectedApps = apps.filter((a) => a.status === 'Rejected');

  const totalDownloads = apps.reduce((sum, a) => sum + a.downloadCount, 0);

  const filteredApps = apps.filter((a) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.developerName.toLowerCase().includes(q) ||
      a.packageName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">APK World Admin Console</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                  System Admin
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Global system stats, store moderation, developer management & site settings</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/moderation"
              className="relative bg-amber-600 hover:bg-amber-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md"
            >
              <CheckSquare className="w-4 h-4" /> Moderation Queue
              {pendingApps.length > 0 && (
                <span className="bg-rose-600 text-white font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                  {pendingApps.length}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* System Analytics Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Pending Approvals</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-3xl font-extrabold text-amber-400 mt-2">{pendingApps.length}</p>
            <p className="text-[10px] text-slate-500 mt-1">Awaiting review</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Live Apps</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-extrabold text-emerald-400 mt-2">{approvedApps.length}</p>
            <p className="text-[10px] text-slate-500 mt-1">Publicly downloadable</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Developers</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-3xl font-extrabold text-indigo-400 mt-2">{developers.length}</p>
            <p className="text-[10px] text-slate-500 mt-1">Registered publisher accounts</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Total Downloads</span>
              <Download className="w-4 h-4 text-teal-400" />
            </div>
            <p className="text-3xl font-extrabold text-teal-400 mt-2">{totalDownloads.toLocaleString()}</p>
            <p className="text-[10px] text-slate-500 mt-1">Across all applications</p>
          </div>
        </div>

        {/* Admin Shortcuts Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/moderation"
            className="bg-slate-900 border border-slate-800 hover:border-indigo-500 p-5 rounded-2xl flex items-center justify-between group transition shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-slate-950 text-indigo-400 border border-slate-800">
                <CheckSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition">App Moderation Queue</h3>
                <p className="text-xs text-slate-400">{pendingApps.length} pending submissions</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition" />
          </Link>

          <Link
            to="/admin/developers"
            className="bg-slate-900 border border-slate-800 hover:border-indigo-500 p-5 rounded-2xl flex items-center justify-between group transition shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-slate-950 text-indigo-400 border border-slate-800">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition">Manage Developers</h3>
                <p className="text-xs text-slate-400">{developers.length} accounts registered</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition" />
          </Link>

          <Link
            to="/admin/settings"
            className="bg-slate-900 border border-slate-800 hover:border-indigo-500 p-5 rounded-2xl flex items-center justify-between group transition shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-slate-950 text-slate-300 border border-slate-800">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition">Site Settings</h3>
                <p className="text-xs text-slate-400">Banners, category configs</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition" />
          </Link>
        </div>

        {/* Full Store Applications Control Table */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white">Full Application Inventory Control</h2>
              <p className="text-xs text-slate-400">Unpublish, view, or remove any application from the store</p>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search inventory..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Application</th>
                  <th className="p-3">Developer</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Downloads</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={app.icon} alt={app.name} className="w-8 h-8 rounded-lg object-cover border border-slate-800" />
                        <div>
                          <Link to={`/app/${app.id}`} className="font-bold text-white hover:text-indigo-400">
                            {app.name}
                          </Link>
                          <p className="text-[10px] text-slate-500 font-mono">{app.packageName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-medium text-slate-300">{app.developerName}</td>
                    <td className="p-3">{app.category}</td>
                    <td className="p-3">
                      {app.status === 'Approved' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Approved
                        </span>
                      )}
                      {app.status === 'Pending' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Pending
                        </span>
                      )}
                      {app.status === 'Rejected' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono font-bold">{app.downloadCount.toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => deleteApp(app.id)}
                        className="text-rose-400 hover:text-rose-300 bg-slate-950 p-1.5 rounded-lg border border-slate-800 transition"
                        title="Delete from store"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
