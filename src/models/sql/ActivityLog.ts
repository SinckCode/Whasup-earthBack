import { DataTypes } from 'sequelize';
import sequelize from '../../config/postgres';

const ActivityLog = sequelize.define(
  'ActivityLog',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    action: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    meta: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    ip: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
  },
  {
    tableName: 'activity_logs',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false,
    indexes: [
      { fields: ['userId'] },
      { fields: ['createdAt'] },
    ],
  }
);

export default ActivityLog;
