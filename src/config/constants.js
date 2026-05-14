module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production',
  JWT_EXPIRES_IN: '7d',
  BCRYPT_ROUNDS: 10,

  ROLES: ['user', 'admin', 'superadmin'],
  DEFAULT_ROLE: 'user',

  ACTIVITIES: [
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
  ],
};
