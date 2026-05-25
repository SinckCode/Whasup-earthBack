export const JWT_SECRET: string = process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production';
export const JWT_EXPIRES_IN = '7d';
export const BCRYPT_ROUNDS = 10;

export const ROLES = ['user', 'admin', 'superadmin'];
export const DEFAULT_ROLE = 'user';

export const ACTIVITIES = [
  'login',
  'logout',
  'register',
  'create_favorite',
  'delete_favorite',
  'create_saved_view',
  'delete_saved_view',
  'create_alert',
  'delete_alert',
  'create_region',
  'delete_region',
  'update_profile',
  'update_preferences',
  'create_comment',
  'delete_comment',
  'view_event',
];
