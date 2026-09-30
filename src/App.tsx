import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { BrowsePage } from './pages/BrowsePage';
import { AppDetailsPage } from './pages/AppDetailsPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { UserLoginPage } from './pages/UserLoginPage';
import { UserSignupPage } from './pages/UserSignupPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { DevLoginPage } from './pages/DevLoginPage';
import { DevSignupPage } from './pages/DevSignupPage';
import { DevDashboardPage } from './pages/DevDashboardPage';
import { PublishApkPage } from './pages/PublishApkPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AppModerationPage } from './pages/AppModerationPage';
import { DeveloperManagementPage } from './pages/DeveloperManagementPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
        className="flex-1 flex flex-col w-full"
      >
        <Routes location={location}>
          {/* Public Store Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/app/:appId" element={<AppDetailsPage />} />
          <Route path="/search" element={<SearchResultsPage />} />

          {/* User Authentication & Dashboard */}
          <Route path="/user/login" element={<UserLoginPage />} />
          <Route path="/user/signup" element={<UserSignupPage />} />
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <UserDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Developer Authentication & Console */}
          <Route path="/dev/login" element={<DevLoginPage />} />
          <Route path="/dev/signup" element={<DevSignupPage />} />
          <Route
            path="/dev/dashboard"
            element={
              <ProtectedRoute allowedRoles={['developer', 'admin']}>
                <DevDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dev/publish"
            element={
              <ProtectedRoute allowedRoles={['developer', 'admin']}>
                <PublishApkPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Portal & Moderation */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/moderation"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AppModerationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/developers"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DeveloperManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  useEffect(() => {
    const preventDefaultDrop = (e: DragEvent) => {
      e.preventDefault();
    };
    window.addEventListener('dragover', preventDefaultDrop);
    window.addEventListener('drop', preventDefaultDrop);
    return () => {
      window.removeEventListener('dragover', preventDefaultDrop);
      window.removeEventListener('drop', preventDefaultDrop);
    };
  }, []);

  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#F9FAFB] font-sans text-slate-900 antialiased selection:bg-[#4F46E5] selection:text-white">
          <Header />
          <main className="flex-1 flex flex-col">
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
