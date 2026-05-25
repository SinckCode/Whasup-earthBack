import { DataTypes } from 'sequelize';
import sequelize from '../../config/postgres';

const Notification = sequelize.define(
  'Notification',
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
    type: {
      type: DataTypes.ENUM('alert_triggered', 'event_update', 'system'),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    eventId: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    alertId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'notifications',
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['userId', 'isRead'] },
    ],
  }
);

export default Notification;
