import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Save, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppCategory } from '../types';

const ALL_CATEGORIES: AppCategory[] = [
  'Games',
  'Tools',
  'Social',
  'Productivity',
  'Media',
  'Education',
  'Personalization',
  'Finance',
];

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, currentRole } = useApp();
  const navigate = useNavigate();

  const [bannerText, setBannerText] = useState(settings.bannerText);
  const [announcementText, setAnnouncementText] = useState(settings.announcementText);
  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenanceMode);
  const [featuredCategories, setFeaturedCategories] = useState<AppCategory[]>(settings.featuredCategories);

  if (currentRole !== 'admin') return null;

  const toggleCategory = (cat: AppCategory) => {
    setFeaturedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      bannerText,
      announcementText,
      maintenanceMode,
      featuredCategories,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-1 font-bold transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Admin Console
        </button>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <Settings className="w-6 h-6 text-indigo-400" />
            <div>
              <h1 className="text-xl font-bold text-white">Store Site Configuration</h1>
              <p className="text-xs text-slate-400 font-medium">Global site announcements, banner text, and feature flags</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Global Top Banner Text</label>
              <input
                type="text"
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Homepage Announcement Message</label>
              <textarea
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Featured Homepage Categories</label>
              <div className="flex flex-wrap gap-2">
                {ALL_CATEGORIES.map((cat) => {
                  const isSelected = featuredCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {cat} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <div>
                <p className="text-xs font-bold text-white">Store Maintenance Mode</p>
                <p className="text-[11px] text-slate-400">Display maintenance message to general visitors</p>
              </div>
              <button
                type="button"
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  maintenanceMode ? 'bg-indigo-600' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    maintenanceMode ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition"
              >
                <Save className="w-4 h-4" /> Save Configuration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
