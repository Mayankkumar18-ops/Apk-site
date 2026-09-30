-- =========================================================
-- APK WORLD - SUPABASE DATABASE SETUP SCHEMA
-- Project ID: yfwumomcuhxfalcknnki
-- Execute this entire script in your Supabase SQL Editor
-- (Supabase Dashboard -> SQL Editor -> New Query -> Run)
-- =========================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar TEXT DEFAULT '',
  joined_date TIMESTAMPTZ DEFAULT NOW(),
  downloaded_app_ids TEXT[] DEFAULT '{}',
  favorites TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DEVELOPERS TABLE
CREATE TABLE IF NOT EXISTS public.developers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT DEFAULT '',
  email TEXT UNIQUE NOT NULL,
  bio TEXT DEFAULT '',
  website TEXT DEFAULT '',
  avatar TEXT DEFAULT '',
  is_suspended BOOLEAN DEFAULT FALSE,
  joined_date TIMESTAMPTZ DEFAULT NOW(),
  total_apps_published INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. APPS TABLE
CREATE TABLE IF NOT EXISTS public.apps (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  package_name TEXT UNIQUE NOT NULL,
  version TEXT DEFAULT '1.0.0',
  developer_id TEXT REFERENCES public.developers(id) ON DELETE SET NULL,
  developer_name TEXT NOT NULL,
  category TEXT NOT NULL,
  short_description TEXT DEFAULT '',
  description TEXT DEFAULT '',
  icon TEXT DEFAULT '',
  screenshots TEXT[] DEFAULT '{}',
  apk_url TEXT DEFAULT '',
  size_mb NUMERIC(8,2) DEFAULT 0.0,
  permissions TEXT[] DEFAULT '{}',
  whats_new TEXT DEFAULT '',
  download_count INT DEFAULT 0,
  avg_rating NUMERIC(3,2) DEFAULT 0.0,
  rating_count INT DEFAULT 0,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  rejection_reason TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  app_id TEXT REFERENCES public.apps(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT DEFAULT '',
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT DEFAULT '',
  date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'global_config',
  banner_text TEXT DEFAULT '',
  announcement_text TEXT DEFAULT '',
  maintenance_mode BOOLEAN DEFAULT FALSE,
  featured_categories TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Grant Public Read/Write Access for Anonymous Keys
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create Permissive Access Policies for direct form submissions & reads
DROP POLICY IF EXISTS "Public Full Access Users" ON public.users;
CREATE POLICY "Public Full Access Users" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access Developers" ON public.developers;
CREATE POLICY "Public Full Access Developers" ON public.developers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access Apps" ON public.apps;
CREATE POLICY "Public Full Access Apps" ON public.apps FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access Reviews" ON public.reviews;
CREATE POLICY "Public Full Access Reviews" ON public.reviews FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access Settings" ON public.site_settings;
CREATE POLICY "Public Full Access Settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- Insert Default Site Settings Record
INSERT INTO public.site_settings (id, banner_text, announcement_text, maintenance_mode, featured_categories)
VALUES ('global_config', 'Welcome to APK World - Verified Android Applications Repository', 'New developer submissions undergoing 24/7 automated virus scanning', false, ARRAY['Games', 'Tools', 'Productivity'])
ON CONFLICT (id) DO NOTHING;
