export type UserRole = 'guest' | 'user' | 'developer' | 'admin';

export type AppStatus = 'Pending' | 'Approved' | 'Rejected';

export type AppCategory =
  | 'Games'
  | 'Tools'
  | 'Social'
  | 'Productivity'
  | 'Media'
  | 'Education'
  | 'Personalization'
  | 'Finance';

export interface Review {
  id: string;
  appId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface AppItem {
  id: string;
  name: string;
  packageName: string;
  category: AppCategory;
  description: string;
  shortDescription: string;
  version: string;
  sizeMb: number;
  developerId: string;
  developerName: string;
  icon: string;
  screenshots: string[];
  permissions: string[];
  downloadCount: number;
  avgRating: number;
  ratingCount: number;
  status: AppStatus;
  rejectionReason?: string;
  createdDate: string;
  updatedDate: string;
  isFeatured?: boolean;
  apkUrl?: string;
}

export interface DeveloperProfile {
  id: string;
  name: string;
  company: string;
  email: string;
  bio: string;
  website?: string;
  avatar: string;
  isSuspended: boolean;
  joinedDate: string;
  totalAppsPublished?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedDate: string;
  downloadedAppIds: string[];
  favorites: string[];
}

export interface SiteSettings {
  bannerText: string;
  featuredCategories: AppCategory[];
  announcementText: string;
  maintenanceMode: boolean;
}
