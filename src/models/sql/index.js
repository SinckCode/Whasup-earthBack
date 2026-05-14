const sequelize = require('../../config/postgres');
const User = require('./User');
const UserPreference = require('./UserPreference');
const Alert = require('./Alert');
const Region = require('./Region');
const ActivityLog = require('./ActivityLog');

// Asociaciones
User.hasOne(UserPreference, { foreignKey: 'userId', as: 'preferences' });
UserPreference.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Alert, { foreignKey: 'userId', as: 'alerts' });
Alert.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Region, { foreignKey: 'userId', as: 'regions' });
Region.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(ActivityLog, { foreignKey: 'userId', as: 'activities' });
ActivityLog.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  UserPreference,
  Alert,
  Region,
  ActivityLog,
};
