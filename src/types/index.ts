import { Request } from 'express';

// ─── SQL Models ─────────────────────────────────────────

export interface IUserAttributes {
  id: number;
  email: string;
  passwordHash: string;
  name: string;
  country: string | null;
  role: 'user' | 'admin';
  avatar: string | null;
  bio: string | null;
  isVerified: boolean;
  lastLoginAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserPreferenceAttributes {
  id: number;
  userId: number;
  theme: 'dark' | 'light';
  defaultCategory: string;
  defaultView: 'map' | 'timeline' | 'stats';
  defaultTimeRange: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAlertAttributes {
  id: number;
  userId: number;
  categorySlug: string;
  regions: string[];
  countries: string[];
  severityMin: number;
  isActive: boolean;
  notifyByEmail: boolean;
  lastTriggeredAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRegionAttributes {
  id: number;
  userId: number;
  name: string;
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
  isDefault: boolean;
  color: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IActivityLogAttributes {
  id: number;
  userId: number | null;
  action: string;
  meta: Record<string, unknown>;
  ip: string | null;
  createdAt?: Date;
}

export interface INotificationAttributes {
  id: number;
  userId: number;
  type: 'alert_triggered' | 'event_update' | 'system';
  title: string;
  message: string;
  eventId: string | null;
  alertId: number | null;
  isRead: boolean;
  readAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// ─── MongoDB Models ─────────────────────────────────────

export interface IEvent {
  eonetId: string;
  title: string;
  description?: string;
  category: string;
  status: 'open' | 'closed';
  coordinates?: number[];
  magnitude?: number;
  startDate?: Date;
  endDate?: Date;
  source: string;
  country?: string;
  region?: string;
  cachedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategory {
  slug: string;
  name: string;
  eonetId: string;
  description?: string;
  icon?: string;
  color: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFavorite {
  userId: number;
  eventId: string;
  title: string;
  category: string;
  link?: string;
  coordinates?: number[];
  firstDate?: Date;
  lastDate?: Date;
  note?: string;
  severity?: number;
  magnitude?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISavedView {
  userId: number;
  name: string;
  description?: string;
  filters: {
    categories: string[];
    countries: string[];
    dateRange: {
      type: string;
      value: number;
    };
    severity: {
      min: number | null;
      max: number | null;
    };
  };
  isPublic: boolean;
  tags: string[];
  viewCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IComment {
  userId: number;
  userName: string;
  eventId: string;
  content: string;
  parentId?: string | null;
  isEdited: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEventStats {
  eventId: string;
  viewCount: number;
  favoriteCount: number;
  commentCount: number;
  lastViewedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// ─── Express Extensions ─────────────────────────────────

export interface AuthRequest extends Request {
  user?: any;
}

export interface JwtPayload {
  id: number;
  role: string;
  iat?: number;
  exp?: number;
}

// ─── Error ──────────────────────────────────────────────

export interface AppError extends Error {
  statusCode?: number;
  status?: number;
  code?: string;
  errors?: any[];
}
