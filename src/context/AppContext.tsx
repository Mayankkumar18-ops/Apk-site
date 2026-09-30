import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppItem,
  DeveloperProfile,
  UserProfile,
  Review,
  SiteSettings,
  UserRole,
} from '../types';
import {
  INITIAL_APPS,
  INITIAL_DEVELOPERS,
  INITIAL_REVIEWS,
  INITIAL_SETTINGS,
  INITIAL_USER,
  INITIAL_USERS,
} from '../data/initialData';
import {
  saveUserToSupabase,
  saveDeveloperToSupabase,
  saveAppToSupabase,
  saveReviewToSupabase,
  saveSettingsToSupabase,
  fetchAppsFromSupabase,
  fetchDevelopersFromSupabase,
  fetchUsersFromSupabase,
  fetchReviewsFromSupabase,
} from '../lib/supabase';


interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: UserProfile | DeveloperProfile | { id: string; name: string; email: string; avatar: string } | null;
  currentRole: UserRole;
  apps: AppItem[];
  approvedApps: AppItem[];
  pendingApps: AppItem[];
  developers: DeveloperProfile[];
  users: UserProfile[];
  reviews: Review[];
  settings: SiteSettings;
  toasts: Toast[];

  // Auth methods
  loginAsUser: (email?: string) => void;
  signupUser: (name: string, email: string) => void;
  loginAsDev: (email?: string) => void;
  signupDev: (name: string, company: string, email: string, bio: string) => void;
  loginAsAdmin: () => void;
  logout: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  updateDevProfile: (updates: Partial<DeveloperProfile>) => void;

  // Management methods for Users & Developers
  addNewUser: (name: string, email: string, avatar?: string) => UserProfile;
  addNewDeveloper: (name: string, company: string, email: string, bio: string, avatar?: string, website?: string) => DeveloperProfile;
  deleteUser: (userId: string) => void;

  // App management
  addApp: (appData: Omit<AppItem, 'id' | 'downloadCount' | 'avgRating' | 'ratingCount' | 'createdDate' | 'updatedDate' | 'status'>) => string;
  updateApp: (id: string, updates: Partial<AppItem>) => void;
  deleteApp: (id: string) => void;
  approveApp: (id: string) => void;
  rejectApp: (id: string, reason: string) => void;

  // Review & Rating
  addReview: (appId: string, rating: number, comment: string) => void;

  // Interactions
  downloadApp: (app: AppItem) => void;
  toggleFavorite: (appId: string) => void;

  // Admin Management
  toggleDevStatus: (devId: string) => void;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;

  // Helper
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  ROLE: 'apkworld_role',
  USER: 'apkworld_current_user',
  USERS: 'apkworld_users_list',
  APPS: 'apkworld_apps',
  DEVELOPERS: 'apkworld_devs',
  REVIEWS: 'apkworld_reviews',
  SETTINGS: 'apkworld_settings',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from localStorage if available
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem(LOCAL_STORAGE_KEYS.ROLE);
    const savedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
    if (savedUser && savedRole) {
      return (savedRole as UserRole);
    }
    return 'guest';
  });

  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) {
          if (parsed.name === 'Alex Rivera') {
            parsed.name = 'Mayank';
            parsed.email = 'mayankkumar1489@gmail.com';
          }
          return parsed;
        }
      } catch (e) { /* default fallback */ }
    }
    return null;
  });

  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* default fallback */ }
    }
    return INITIAL_USERS;
  });

  const [apps, setApps] = useState<AppItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.APPS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* default fallback */ }
    }
    return INITIAL_APPS;
  });

  const [developers, setDevelopers] = useState<DeveloperProfile[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.DEVELOPERS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* default fallback */ }
    }
    return INITIAL_DEVELOPERS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.REVIEWS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* default fallback */ }
    }
    return INITIAL_REVIEWS;
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* default fallback */ }
    }
    return INITIAL_SETTINGS;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ROLE, currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.APPS, JSON.stringify(apps));
  }, [apps]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.DEVELOPERS, JSON.stringify(developers));
  }, [developers]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Sync initial records from Supabase if present
  useEffect(() => {
    const loadSupabaseData = async () => {
      const [dbApps, dbDevs, dbUsers, dbReviews] = await Promise.all([
        fetchAppsFromSupabase(),
        fetchDevelopersFromSupabase(),
        fetchUsersFromSupabase(),
        fetchReviewsFromSupabase(),
      ]);

      if (dbApps) setApps((prev) => [...dbApps, ...prev.filter((a) => !dbApps.some((da) => da.id === a.id))]);
      if (dbDevs) setDevelopers((prev) => [...dbDevs, ...prev.filter((d) => !dbDevs.some((dd) => dd.id === d.id))]);
      if (dbUsers) setUsers((prev) => [...dbUsers, ...prev.filter((u) => !dbUsers.some((du) => du.id === u.id))]);
      if (dbReviews) setReviews((prev) => [...dbReviews, ...prev.filter((r) => !dbReviews.some((dr) => dr.id === r.id))]);
    };

    loadSupabaseData();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 4);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Auth logic
  const loginAsUser = (email?: string) => {
    const user = INITIAL_USER;
    if (email) user.email = email;
    setCurrentRole('user');
    setCurrentUser(user);
    showToast(`Logged in as User (${user.name})`);
  };

  const signupUser = (name: string, email: string) => {
    const newUser: UserProfile = {
      id: 'user_' + Date.now(),
      name,
      email,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
      joinedDate: new Date().toISOString().split('T')[0],
      downloadedAppIds: [],
      favorites: [],
    };
    setUsers((prev) => [newUser, ...prev]);
    setCurrentRole('user');
    setCurrentUser(newUser);
    saveUserToSupabase(newUser);
    showToast(`Account created successfully! Welcome, ${name}.`);
  };

  const addNewUser = (name: string, email: string, avatar?: string): UserProfile => {
    const newUser: UserProfile = {
      id: 'user_' + Date.now(),
      name,
      email,
      avatar: avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
      joinedDate: new Date().toISOString().split('T')[0],
      downloadedAppIds: [],
      favorites: [],
    };
    setUsers((prev) => [newUser, ...prev]);
    saveUserToSupabase(newUser);
    showToast(`New user "${name}" added successfully!`);
    return newUser;
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    showToast(`User removed from database.`, 'info');
  };

  const addNewDeveloper = (
    name: string,
    company: string,
    email: string,
    bio: string,
    avatar?: string,
    website?: string
  ): DeveloperProfile => {
    const newDev: DeveloperProfile = {
      id: 'dev_' + Date.now(),
      name,
      company: company || name + ' Studio',
      email,
      bio: bio || 'Android app developer and publisher.',
      website,
      avatar: avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
      isSuspended: false,
      joinedDate: new Date().toISOString().split('T')[0],
      totalAppsPublished: 0,
    };
    setDevelopers((prev) => [newDev, ...prev]);
    saveDeveloperToSupabase(newDev);
    showToast(`Developer "${name}" added successfully!`);
    return newDev;
  };

  const loginAsDev = (email?: string) => {
    const dev = developers.find((d) => !email || d.email === email) || developers[0];
    setCurrentRole('developer');
    setCurrentUser(dev);
    showToast(`Logged in as Developer (${dev.name})`);
  };

  const signupDev = (name: string, company: string, email: string, bio: string) => {
    const newDev: DeveloperProfile = {
      id: 'dev_' + Date.now(),
      name,
      company: company || name + ' Dev',
      email,
      bio,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
      isSuspended: false,
      joinedDate: new Date().toISOString().split('T')[0],
      totalAppsPublished: 0,
    };
    setDevelopers((prev) => [...prev, newDev]);
    setCurrentRole('developer');
    setCurrentUser(newDev);
    saveDeveloperToSupabase(newDev);
    showToast(`Developer profile created! Welcome to APK World, ${name}.`);
  };

  const loginAsAdmin = () => {
    const adminUser = {
      id: 'admin_1',
      name: 'System Admin',
      email: 'admin@apkworld.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    };
    setCurrentRole('admin');
    setCurrentUser(adminUser);
    showToast('Authenticated as Administrator', 'info');
  };

  const logout = () => {
    setCurrentRole('guest');
    setCurrentUser(null);
    showToast('Logged out successfully', 'info');
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (currentRole === 'user' && currentUser) {
      const updated = { ...currentUser, ...updates };
      setCurrentUser(updated);
      saveUserToSupabase(updated);
      showToast('Profile updated!');
    }
  };

  const updateDevProfile = (updates: Partial<DeveloperProfile>) => {
    if (currentRole === 'developer' && currentUser) {
      const updated = { ...currentUser, ...updates };
      setCurrentUser(updated);
      setDevelopers((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      saveDeveloperToSupabase(updated);
      showToast('Developer profile updated!');
    }
  };

  // App logic
  const addApp = (appData: Omit<AppItem, 'id' | 'downloadCount' | 'avgRating' | 'ratingCount' | 'createdDate' | 'updatedDate' | 'status'>) => {
    const id = 'app_' + Date.now();
    const today = new Date().toISOString().split('T')[0];
    const newApp: AppItem = {
      ...appData,
      id,
      downloadCount: 0,
      avgRating: 0,
      ratingCount: 0,
      status: 'Pending',
      createdDate: today,
      updatedDate: today,
    };

    setApps((prev) => [newApp, ...prev]);
    saveAppToSupabase(newApp);
    showToast('App submitted for Admin approval!', 'info');
    return id;
  };

  const updateApp = (id: string, updates: Partial<AppItem>) => {
    const today = new Date().toISOString().split('T')[0];
    let updatedAppObj: AppItem | null = null;
    setApps((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          // If a developer updates a rejected app, set status back to Pending
          const newStatus = app.status === 'Rejected' ? 'Pending' : app.status;
          updatedAppObj = {
            ...app,
            ...updates,
            status: newStatus,
            rejectionReason: newStatus === 'Pending' ? undefined : app.rejectionReason,
            updatedDate: today,
          };
          return updatedAppObj;
        }
        return app;
      })
    );
    if (updatedAppObj) {
      saveAppToSupabase(updatedAppObj);
    }
    showToast('App details updated successfully!');
  };

  const deleteApp = (id: string) => {
    setApps((prev) => prev.filter((a) => a.id !== id));
    showToast('App removed from APK World');
  };

  const approveApp = (id: string) => {
    let approvedAppObj: AppItem | null = null;
    setApps((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          approvedAppObj = { ...app, status: 'Approved', rejectionReason: undefined };
          return approvedAppObj;
        }
        return app;
      })
    );
    if (approvedAppObj) {
      saveAppToSupabase(approvedAppObj);
    }
    showToast('App approved and published to store!', 'success');
  };

  const rejectApp = (id: string, reason: string) => {
    let rejectedAppObj: AppItem | null = null;
    setApps((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          rejectedAppObj = { ...app, status: 'Rejected', rejectionReason: reason };
          return rejectedAppObj;
        }
        return app;
      })
    );
    if (rejectedAppObj) {
      saveAppToSupabase(rejectedAppObj);
    }
    showToast('App submission rejected.', 'error');
  };

  // Reviews & ratings
  const addReview = (appId: string, rating: number, comment: string) => {
    if (!currentUser || currentRole === 'guest') {
      showToast('Please log in to submit a review', 'error');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const newReview: Review = {
      id: 'rev_' + Date.now(),
      appId,
      userId: currentUser.id,
      userName: currentUser.name || 'Anonymous User',
      userAvatar: currentUser.avatar,
      rating,
      comment,
      date: today,
    };

    saveReviewToSupabase(newReview);

    // Replace previous review if existing, or add
    setReviews((prev) => {
      const filtered = prev.filter((r) => !(r.appId === appId && r.userId === currentUser.id));
      const updated = [newReview, ...filtered];

      // Re-calculate average rating for this app
      const appReviews = updated.filter((r) => r.appId === appId);
      const total = appReviews.reduce((sum, r) => sum + r.rating, 0);
      const avg = +(total / appReviews.length).toFixed(1);

      setApps((prevApps) =>
        prevApps.map((a) => {
          if (a.id === appId) {
            const updatedApp = { ...a, avgRating: avg, ratingCount: appReviews.length };
            saveAppToSupabase(updatedApp);
            return updatedApp;
          }
          return a;
        })
      );

      return updated;
    });

    showToast('Thank you for your rating & review!');
  };

  // Downloads
  const downloadApp = (app: AppItem) => {
    // 1. Increment app download count
    setApps((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, downloadCount: a.downloadCount + 1 } : a))
    );

    // 2. Add to user's history if logged in as user
    if (currentRole === 'user' && currentUser) {
      const downloaded = currentUser.downloadedAppIds || [];
      if (!downloaded.includes(app.id)) {
        const updatedUser = {
          ...currentUser,
          downloadedAppIds: [...downloaded, app.id],
        };
        setCurrentUser(updatedUser);
      }
    }

    // 3. Trigger mock file download
    const dummyApkContent = `APK World Mock Package\nApp Name: ${app.name}\nVersion: ${app.version}\nPackage Name: ${app.packageName}\nSize: ${app.sizeMb}MB\nDeveloper: ${app.developerName}\nStatus: ${app.status}\n\nDownloaded from APK World Store.`;
    const blob = new Blob([dummyApkContent], { type: 'application/vnd.android.package-archive' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${app.name.toLowerCase().replace(/\s+/g, '_')}_v${app.version}.apk`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Downloading ${app.name} APK (${app.sizeMb}MB)...`, 'success');
  };

  // Favorites
  const toggleFavorite = (appId: string) => {
    if (currentRole !== 'user' || !currentUser) {
      showToast('Log in as User to bookmark favorites', 'info');
      return;
    }
    const favs = currentUser.favorites || [];
    const isFav = favs.includes(appId);
    const updatedFavs = isFav ? favs.filter((id: string) => id !== appId) : [...favs, appId];
    setCurrentUser({ ...currentUser, favorites: updatedFavs });
    showToast(isFav ? 'Removed from favorites' : 'Added to favorites');
  };

  // Developer status toggle
  const toggleDevStatus = (devId: string) => {
    setDevelopers((prev) =>
      prev.map((d) => (d.id === devId ? { ...d, isSuspended: !d.isSuspended } : d))
    );
    showToast('Developer account status updated', 'info');
  };

  // Settings
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => {
      const merged = { ...prev, ...newSettings };
      saveSettingsToSupabase(merged);
      return merged;
    });
    showToast('Site settings updated!');
  };

  const safeApps = Array.isArray(apps) ? apps : [];
  const approvedApps = safeApps.filter((a) => a.status === 'Approved');
  const pendingApps = safeApps.filter((a) => a.status === 'Pending');

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        apps: safeApps,
        approvedApps,
        pendingApps,
        developers: Array.isArray(developers) ? developers : [],
        users: Array.isArray(users) ? users : [],
        reviews: Array.isArray(reviews) ? reviews : [],
        settings,
        toasts,
        loginAsUser,
        signupUser,
        loginAsDev,
        signupDev,
        loginAsAdmin,
        logout,
        updateUserProfile,
        updateDevProfile,
        addNewUser,
        addNewDeveloper,
        deleteUser,
        addApp,
        updateApp,
        deleteApp,
        approveApp,
        rejectApp,
        addReview,
        downloadApp,
        toggleFavorite,
        toggleDevStatus,
        updateSettings,
        showToast,
      }}
    >
      {children}

      {/* Floating Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all duration-300 flex items-center gap-3 ${
              toast.type === 'error'
                ? 'bg-red-900/90 text-red-100 border-red-700'
                : toast.type === 'info'
                ? 'bg-indigo-900/90 text-indigo-100 border-indigo-700'
                : 'bg-emerald-900/90 text-emerald-100 border-emerald-700'
            }`}
          >
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
