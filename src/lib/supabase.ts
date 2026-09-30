import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://yfwumomcuhxfalcknnki.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_-Wej_glu0bTBOq50a-EqNA_46dB_dMK';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper functions to save form submissions directly to Supabase tables

/**
 * Save user signup details to Supabase 'users' table
 */
export async function saveUserToSupabase(user: {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedDate?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || '',
          joined_date: user.joinedDate || new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (error) {
      console.warn('Supabase users save notice:', error.message);
    } else {
      console.log('Successfully saved user submission to Supabase:', data);
    }
  } catch (err) {
    console.error('Failed to sync user to Supabase:', err);
  }
}

/**
 * Save developer signup details to Supabase 'developers' table
 */
export async function saveDeveloperToSupabase(dev: {
  id: string;
  name: string;
  company?: string;
  email: string;
  bio?: string;
  website?: string;
  avatar?: string;
  joinedDate?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('developers')
      .upsert(
        {
          id: dev.id,
          name: dev.name,
          company: dev.company || '',
          email: dev.email,
          bio: dev.bio || '',
          website: dev.website || '',
          avatar: dev.avatar || '',
          joined_date: dev.joinedDate || new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (error) {
      console.warn('Supabase developers save notice:', error.message);
    } else {
      console.log('Successfully saved developer submission to Supabase:', data);
    }
  } catch (err) {
    console.error('Failed to sync developer to Supabase:', err);
  }
}

/**
 * Save APK / App submission details to Supabase 'apps' table
 */
export async function saveAppToSupabase(app: {
  id: string;
  name: string;
  packageName: string;
  version: string;
  developerId: string;
  developerName: string;
  category: string;
  shortDescription: string;
  description: string;
  icon: string;
  screenshots: string[];
  apkUrl?: string;
  sizeMb: number;
  permissions: string[];
  whatsNew?: string;
  status: string;
  rejectionReason?: string;
  createdDate?: string;
  updatedDate?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('apps')
      .upsert(
        {
          id: app.id,
          name: app.name,
          package_name: app.packageName,
          version: app.version,
          developer_id: app.developerId,
          developer_name: app.developerName,
          category: app.category,
          short_description: app.shortDescription,
          description: app.description,
          icon: app.icon,
          screenshots: app.screenshots || [],
          apk_url: app.apkUrl || '',
          size_mb: app.sizeMb,
          permissions: app.permissions || [],
          whats_new: app.whatsNew || '',
          status: app.status,
          rejection_reason: app.rejectionReason || null,
          created_date: app.createdDate || new Date().toISOString(),
          updated_date: app.updatedDate || new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (error) {
      console.warn('Supabase apps save notice:', error.message);
    } else {
      console.log('Successfully saved app submission to Supabase:', data);
    }
  } catch (err) {
    console.error('Failed to sync app to Supabase:', err);
  }
}

/**
 * Save review & rating form submission to Supabase 'reviews' table
 */
export async function saveReviewToSupabase(review: {
  id: string;
  appId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .upsert(
        {
          id: review.id,
          app_id: review.appId,
          user_id: review.userId,
          user_name: review.userName,
          user_avatar: review.userAvatar || '',
          rating: review.rating,
          comment: review.comment,
          date: review.date || new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (error) {
      console.warn('Supabase reviews save notice:', error.message);
    } else {
      console.log('Successfully saved review submission to Supabase:', data);
    }
  } catch (err) {
    console.error('Failed to sync review to Supabase:', err);
  }
}

/**
 * Save site settings form submission to Supabase 'site_settings' table
 */
export async function saveSettingsToSupabase(settings: {
  bannerText?: string;
  announcementText?: string;
  maintenanceMode?: boolean;
  featuredCategories?: string[];
}) {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .upsert(
        {
          id: 'global_config',
          banner_text: settings.bannerText || '',
          announcement_text: settings.announcementText || '',
          maintenance_mode: !!settings.maintenanceMode,
          featured_categories: settings.featuredCategories || [],
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (error) {
      console.warn('Supabase site_settings save notice:', error.message);
    } else {
      console.log('Successfully saved settings to Supabase:', data);
    }
  } catch (err) {
    console.error('Failed to sync settings to Supabase:', err);
  }
}

// Fetch helper functions
export async function fetchAppsFromSupabase() {
  try {
    const { data, error } = await supabase.from('apps').select('*');
    if (error || !data || data.length === 0) return null;
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      packageName: item.package_name,
      version: item.version,
      developerId: item.developer_id,
      developerName: item.developer_name,
      category: item.category,
      shortDescription: item.short_description,
      description: item.description,
      icon: item.icon,
      screenshots: item.screenshots || [],
      apkUrl: item.apk_url,
      sizeMb: item.size_mb,
      downloadCount: item.download_count || 0,
      avgRating: item.avg_rating || 0,
      ratingCount: item.rating_count || 0,
      permissions: item.permissions || [],
      whatsNew: item.whats_new,
      status: item.status,
      rejectionReason: item.rejection_reason,
      createdDate: item.created_date,
      updatedDate: item.updated_date,
    }));
  } catch {
    return null;
  }
}

export async function fetchDevelopersFromSupabase() {
  try {
    const { data, error } = await supabase.from('developers').select('*');
    if (error || !data || data.length === 0) return null;
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      company: item.company,
      email: item.email,
      bio: item.bio,
      website: item.website,
      avatar: item.avatar,
      isSuspended: !!item.is_suspended,
      joinedDate: item.joined_date,
      totalAppsPublished: item.total_apps_published || 0,
    }));
  } catch {
    return null;
  }
}

export async function fetchUsersFromSupabase() {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error || !data || data.length === 0) return null;
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      avatar: item.avatar,
      joinedDate: item.joined_date,
      downloadedAppIds: item.downloaded_app_ids || [],
      favorites: item.favorites || [],
    }));
  } catch {
    return null;
  }
}

export async function fetchReviewsFromSupabase() {
  try {
    const { data, error } = await supabase.from('reviews').select('*');
    if (error || !data || data.length === 0) return null;
    return data.map((item: any) => ({
      id: item.id,
      appId: item.app_id,
      userId: item.user_id,
      userName: item.user_name,
      userAvatar: item.user_avatar,
      rating: item.rating,
      comment: item.comment,
      date: item.date,
    }));
  } catch {
    return null;
  }
}

