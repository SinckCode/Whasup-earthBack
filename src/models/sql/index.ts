import sequelize from '../../config/postgres';
import User from './User';
import UserPreference from './UserPreference';
import Alert from './Alert';
import Region from './Region';
import ActivityLog from './ActivityLog';
import Notification from './Notification';

// Asociaciones
User.hasOne(UserPreference, { foreignKey: 'userId', as: 'preferences' });
UserPreference.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Alert, { foreignKey: 'userId', as: 'alerts' });
Alert.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Region, { foreignKey: 'userId', as: 'regions' });
Region.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(ActivityLog, { foreignKey: 'userId', as: 'activities' });
ActivityLog.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId' });

export { sequelize, User, UserPreference, Alert, Region, ActivityLog, Notification };
