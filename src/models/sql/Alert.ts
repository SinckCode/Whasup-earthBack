import { DataTypes } from 'sequelize';
import sequelize from '../../config/postgres';

const Alert = sequelize.define(
  'Alert',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    categorySlug: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    regions: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    countries: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    severityMin: {
      type: DataTypes.REAL,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    notifyByEmail: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastTriggeredAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'alerts',
    timestamps: true,
    indexes: [{ fields: ['userId'] }],
  }
);

export default Alert;
