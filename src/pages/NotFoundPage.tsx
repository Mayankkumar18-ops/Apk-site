import React from 'react';
import { Link } from 'react-router-dom';
import { Download, AlertCircle, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-4">
        <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-white">404</h1>
        <h2 className="text-lg font-bold text-slate-200">Page Not Found</h2>
        <p className="text-xs text-slate-400">
          The page or APK resource you requested does not exist or has been moved.
        </p>

        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" /> Return to APK World Store
        </Link>
      </div>
    </div>
  );
};
