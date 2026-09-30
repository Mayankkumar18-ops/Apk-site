import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, UserX, UserCheck, ArrowLeft, Search, Building, Mail, X, Trash2, Code } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DeveloperManagementPage: React.FC = () => {
  const { developers, users, apps, toggleDevStatus, addNewDeveloper, addNewUser, deleteUser, currentRole } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'developers' | 'users'>('developers');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Developer Modal State
  const [showAddDevModal, setShowAddDevModal] = useState(false);
  const [devName, setDevName] = useState('');
  const [devCompany, setDevCompany] = useState('');
  const [devEmail, setDevEmail] = useState('');
  const [devBio, setDevBio] = useState('');
  const [devWebsite, setDevWebsite] = useState('');

  // Add User Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  if (currentRole !== 'admin') return null;

  const filteredDevs = developers.filter((dev) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      dev.name.toLowerCase().includes(q) ||
      dev.company.toLowerCase().includes(q) ||
      dev.email.toLowerCase().includes(q)
    );
  });

  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const handleCreateDeveloper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!devName || !devEmail) return;
    addNewDeveloper(devName, devCompany, devEmail, devBio, undefined, devWebsite);
    setDevName('');
    setDevCompany('');
    setDevEmail('');
    setDevBio('');
    setDevWebsite('');
    setShowAddDevModal(false);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail) return;
    addNewUser(userName, userEmail);
    setUserName('');
    setUserEmail('');
    setShowAddUserModal(false);
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

        {/* Header & Controls */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-indigo-400" /> Account Management
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Audit and create developer publisher profiles or end-user accounts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-56">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search accounts..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            </div>

            {activeTab === 'developers' ? (
              <button
                onClick={() => setShowAddDevModal(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <UserPlus className="w-4 h-4" /> + Add Developer
              </button>
            ) : (
              <button
                onClick={() => setShowAddUserModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <UserPlus className="w-4 h-4" /> + Add User
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('developers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'developers'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Code className="w-4 h-4" /> Registered Developers ({developers.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" /> End Users ({users.length})
          </button>
        </div>

        {/* Developer List */}
        {activeTab === 'developers' && (
          <div className="space-y-4">
            {filteredDevs.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center text-xs text-slate-400 font-bold">
                No developer accounts found.
              </div>
            ) : (
              filteredDevs.map((dev) => {
                const devApps = apps.filter(
                  (a) => a.developerId === dev.id || a.developerName.toLowerCase() === dev.name.toLowerCase()
                );

                return (
                  <div
                    key={dev.id}
                    className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={dev.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                        alt={dev.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-800"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">{dev.name}</h3>
                          {dev.isSuspended ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              Suspended
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Active Publisher
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5 font-medium">
                          <span className="flex items-center gap-1"><Building className="w-3 h-3 text-indigo-400" /> {dev.company}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-indigo-400" /> {dev.email}</span>
                        </p>

                        <p className="text-xs text-slate-300 mt-1 max-w-lg line-clamp-1 font-medium">{dev.bio}</p>
                        <p className="text-[11px] text-slate-400 mt-1 font-bold">
                          Published Apps: <span className="text-white font-black">{devApps.length}</span>
                        </p>
                      </div>
                    </div>

                    <div className="self-end sm:self-center">
                      <button
                        onClick={() => toggleDevStatus(dev.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                          dev.isSuspended
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-rose-600 hover:bg-rose-500 text-white'
                        }`}
                      >
                        {dev.isSuspended ? (
                          <>
                            <UserCheck className="w-4 h-4" /> Activate Developer
                          </>
                        ) : (
                          <>
                            <UserX className="w-4 h-4" /> Suspend Account
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Users List */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center text-xs text-slate-400 font-bold">
                No user accounts found.
              </div>
            ) : (
              filteredUsers.map((u) => (
                <div
                  key={u.id}
                  className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                      alt={u.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-800"
                    />
                    <div>
                      <h3 className="text-base font-bold text-white">{u.name}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                        <Mail className="w-3 h-3 text-indigo-400" /> {u.email} • Joined {u.joinedDate}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 font-bold">
                        Downloads: {u.downloadedAppIds?.length || 0} • Favorites: {u.favorites?.length || 0}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteUser(u.id)}
                    className="p-2.5 bg-slate-950 hover:bg-rose-600 hover:text-white text-rose-400 border border-slate-800 rounded-xl transition"
                    title="Remove User"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Add Developer Modal */}
      {showAddDevModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-400" /> Create New Developer
              </h3>
              <button
                onClick={() => setShowAddDevModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDeveloper} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Developer / Studio Name *</label>
                <input
                  type="text"
                  required
                  value={devName}
                  onChange={(e) => setDevName(e.target.value)}
                  placeholder="e.g. Nexus Software"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Company / Organization</label>
                <input
                  type="text"
                  value={devCompany}
                  onChange={(e) => setDevCompany(e.target.value)}
                  placeholder="e.g. Nexus Softworks Ltd."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={devEmail}
                  onChange={(e) => setDevEmail(e.target.value)}
                  placeholder="dev@nexus.io"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Website URL</label>
                <input
                  type="url"
                  value={devWebsite}
                  onChange={(e) => setDevWebsite(e.target.value)}
                  placeholder="https://nexus.io"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Developer Bio</label>
                <textarea
                  value={devBio}
                  onChange={(e) => setDevBio(e.target.value)}
                  placeholder="Short description of products and specialties..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddDevModal(false)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Save Developer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-400" /> Create New User Account
              </h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Save User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
