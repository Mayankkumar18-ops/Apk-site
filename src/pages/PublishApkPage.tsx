import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Upload,
  PlusCircle,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  FileCode,
  ArrowLeft,
  Shield,
  X,
  Plus,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppCategory, DeveloperProfile } from '../types';

const CATEGORIES: AppCategory[] = [
  'Games',
  'Tools',
  'Social',
  'Productivity',
  'Media',
  'Education',
  'Personalization',
  'Finance',
];

const AVAILABLE_PERMISSIONS = [
  'Storage Access',
  'Camera',
  'Microphone',
  'Network Access',
  'Contacts',
  'Location',
  'Notifications',
  'Biometric Hardware',
  'System Settings',
  'Foreground Service',
];

const PRESET_ICONS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1614680376593-902f749f7cfc?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=300&q=80',
];

const PRESET_SCREENSHOTS = [
  'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=800&q=80',
];

export const PublishApkPage: React.FC = () => {
  const { currentUser, currentRole, apps, addApp, updateApp, showToast } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('editId');

  const existingApp = editId ? apps.find((a) => a.id === editId) : null;

  // Form Fields
  const [name, setName] = useState(existingApp?.name || '');
  const [packageName, setPackageName] = useState(existingApp?.packageName || '');
  const [category, setCategory] = useState<AppCategory>(existingApp?.category || 'Tools');
  const [version, setVersion] = useState(existingApp?.version || '1.0.0');
  const [sizeMb, setSizeMb] = useState<number>(existingApp?.sizeMb || 25.0);
  const [shortDescription, setShortDescription] = useState(existingApp?.shortDescription || '');
  const [description, setDescription] = useState(existingApp?.description || '');
  const [permissions, setPermissions] = useState<string[]>(
    existingApp?.permissions || ['Storage Access', 'Network Access']
  );
  const [apkFileName, setApkFileName] = useState<string | null>(
    existingApp ? `${existingApp.name.toLowerCase().replace(/\s+/g, '_')}.apk` : null
  );
  const [iconUrl, setIconUrl] = useState(
    existingApp?.icon || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80'
  );
  const [screenshots, setScreenshots] = useState<string[]>(
    existingApp?.screenshots || [
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=800&q=80',
    ]
  );
  const [newScreenshotUrl, setNewScreenshotUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (existingApp) {
      setName(existingApp.name);
      setPackageName(existingApp.packageName);
      setCategory(existingApp.category);
      setVersion(existingApp.version);
      setSizeMb(existingApp.sizeMb);
      setShortDescription(existingApp.shortDescription);
      setDescription(existingApp.description);
      setPermissions(existingApp.permissions || []);
      setIconUrl(existingApp.icon);
      setScreenshots(existingApp.screenshots || []);
      setApkFileName(`${existingApp.name.toLowerCase().replace(/\s+/g, '_')}.apk`);
    }
  }, [existingApp]);

  const togglePermission = (perm: string) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.apk')) {
        setApkFileName(file.name);
        showToast(`Selected APK: ${file.name}`);
      } else {
        showToast('Please select a valid .apk file', 'error');
      }
    }
  };

  const handleMockApkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setApkFileName(file.name);
      showToast(`Selected APK: ${file.name}`);
    }
  };

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      setIconUrl(objectUrl);
      showToast('Custom Icon image uploaded!');
    }
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newUrls = filesArray.map((file: File) => URL.createObjectURL(file));
      setScreenshots((prev) => [...prev, ...newUrls]);
      showToast(`Added ${filesArray.length} screenshot(s)`);
    }
  };

  const handleAddScreenshotByUrl = () => {
    if (newScreenshotUrl.trim()) {
      setScreenshots((prev) => [...prev, newScreenshotUrl.trim()]);
      setNewScreenshotUrl('');
      showToast('Screenshot URL added');
    }
  };

  const handleRemoveScreenshot = (index: number) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !packageName || !shortDescription) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    const devProfile: DeveloperProfile = {
      id: currentUser?.id || 'dev-demo',
      name: currentUser?.name || 'Indie Developer Studio',
      email: currentUser?.email || 'dev@apkworld.com',
      company: 'Apex Mobile Tech',
      bio: 'Verified Android APK Developer',
      website: 'https://apexstudio.example.com',
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isSuspended: false,
      joinedDate: new Date().toISOString().split('T')[0],
      totalAppsPublished: 1,
    };

    if (existingApp) {
      updateApp(existingApp.id, {
        name,
        packageName,
        category,
        version,
        sizeMb,
        shortDescription,
        description,
        permissions,
        icon: iconUrl,
        screenshots,
        downloadUrl: `https://cdn.apkworld.com/downloads/${packageName}-${version}.apk`,
        status: 'Pending', // Sent back for admin re-verification
      });
      showToast('APK updated & submitted for re-moderation!');
    } else {
      addApp({
        name,
        packageName,
        category,
        version,
        sizeMb,
        shortDescription,
        description,
        permissions,
        icon: iconUrl,
        screenshots,
        downloadUrl: `https://cdn.apkworld.com/downloads/${packageName}-${version}.apk`,
        developerId: devProfile.id,
        developerName: devProfile.name,
        developer: devProfile,
        status: 'Pending',
        createdDate: new Date().toISOString().split('T')[0],
      });
      showToast('APK published successfully & sent for admin review!');
    }

    navigate('/dev/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => navigate('/dev/dashboard')}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dev Console
        </button>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {existingApp ? 'Edit & Resubmit APK' : 'Publish New APK Application'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Submissions undergo automated virus scanning and admin moderation before appearing publicly.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Supabase Backend Connected
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* APK File Dropzone */}
            <div
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer relative ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01] shadow-xl'
                  : apkFileName
                  ? 'border-emerald-500/50 bg-slate-950'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950'
              }`}
            >
              <Upload
                className={`w-10 h-10 mx-auto mb-3 transition-transform ${
                  isDragging
                    ? 'text-indigo-400 scale-110 animate-bounce'
                    : apkFileName
                    ? 'text-emerald-400'
                    : 'text-indigo-400'
                }`}
              />
              <h3 className="text-sm font-bold text-white">
                {isDragging
                  ? 'Drop your .apk file here!'
                  : apkFileName
                  ? `Selected File: ${apkFileName}`
                  : 'Upload Android Package (.apk)'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isDragging
                  ? 'Release to upload immediately'
                  : 'Drag and drop your signed .apk file here, or click to browse file'}
              </p>
              <input
                type="file"
                accept=".apk"
                onChange={handleMockApkUpload}
                className="hidden"
                id="apk-upload-input"
              />
              <label
                htmlFor="apk-upload-input"
                className="mt-4 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer border border-indigo-500 transition shadow-md"
              >
                <Upload className="w-3.5 h-3.5" />
                {apkFileName ? 'Change APK File' : 'Select APK File'}
              </label>
            </div>

            {/* App Icon Upload Section */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-indigo-400" />
                  Application Icon Image *
                </label>
                <span className="text-[10px] text-slate-500">PNG, JPG, WebP recommended</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Icon Preview */}
                <div className="relative group">
                  <img
                    src={iconUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80'}
                    alt="App Icon Preview"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-800 shadow-md bg-slate-900"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">Preview</span>
                  </div>
                </div>

                {/* Upload & URL Controls */}
                <div className="flex-1 space-y-3 w-full">
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIconUpload}
                      className="hidden"
                      id="app-icon-file-input"
                    />
                    <label
                      htmlFor="app-icon-file-input"
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 border border-slate-700 transition"
                    >
                      <Upload className="w-3.5 h-3.5" /> Choose Local Image File
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={iconUrl}
                      onChange={(e) => setIconUrl(e.target.value)}
                      placeholder="Or paste image URL (https://...)"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Preset Icons */}
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1">Or pick a sample icon preset:</span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {PRESET_ICONS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setIconUrl(preset)}
                          className={`w-8 h-8 rounded-lg overflow-hidden border-2 transition ${
                            iconUrl === preset ? 'border-indigo-500 scale-110 shadow-md' : 'border-slate-800 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* App Screenshots Upload Section */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-indigo-400" />
                    App Screenshots Gallery ({screenshots.length})
                  </label>
                  <p className="text-[11px] text-slate-500">Add images to showcase app features and interface</p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleScreenshotUpload}
                    className="hidden"
                    id="screenshots-file-input"
                  />
                  <label
                    htmlFor="screenshots-file-input"
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1 border border-slate-700 transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Upload Images
                  </label>
                </div>
              </div>

              {/* Screenshots Grid */}
              {screenshots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {screenshots.map((url, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-md aspect-video">
                      <img src={url} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveScreenshot(idx)}
                        className="absolute top-1.5 right-1.5 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-full shadow-md transition opacity-90 hover:opacity-100"
                        title="Remove Screenshot"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-1 left-1.5 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl text-xs text-slate-500 space-y-1">
                  <ImageIcon className="w-6 h-6 mx-auto text-slate-600" />
                  <p>No screenshots added yet.</p>
                  <p className="text-[10px]">Upload local images or pick samples below.</p>
                </div>
              )}

              {/* Add screenshot by URL */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  value={newScreenshotUrl}
                  onChange={(e) => setNewScreenshotUrl(e.target.value)}
                  placeholder="Paste image URL to add screenshot..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddScreenshotByUrl}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition shadow-md whitespace-nowrap"
                >
                  Add URL
                </button>
              </div>

              {/* Preset Sample Screenshots */}
              <div>
                <span className="text-[10px] text-slate-500 block mb-1">Quick add sample screenshots:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {PRESET_SCREENSHOTS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setScreenshots((prev) => [...prev, preset]);
                        showToast('Added sample screenshot');
                      }}
                      className="text-[11px] bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-400" /> Sample {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* App Basics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Application Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Pulse Cleaner Pro"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Package Name (App ID) *</label>
                <input
                  type="text"
                  required
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  placeholder="com.apexstudio.pulsecleaner"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as AppCategory)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Version String *</label>
                <input
                  type="text"
                  required
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="1.0.0"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">File Size (MB) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={sizeMb}
                  onChange={(e) => setSizeMb(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Descriptions */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Short Description *</label>
              <input
                type="text"
                required
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="One-line tagline summary for store cards..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Description *</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Comprehensive overview of features, updates, and functionality..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Permissions Multi-select */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Requested App Permissions</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AVAILABLE_PERMISSIONS.map((perm) => {
                  const isChecked = permissions.includes(perm);
                  return (
                    <button
                      type="button"
                      key={perm}
                      onClick={() => togglePermission(perm)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium text-left border transition flex items-center justify-between ${
                        isChecked
                          ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/50'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{perm}</span>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/dev/dashboard')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                {existingApp ? 'Update & Save to Supabase' : 'Submit & Save to Supabase'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
