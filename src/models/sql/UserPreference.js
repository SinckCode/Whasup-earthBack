const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgres');

const UserPreference = sequelize.define(
  'UserPreference',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    theme: {
      type: DataTypes.ENUM('dark', 'light'),
      defaultValue: 'dark',
    },
    defaultCategory: {
      type: DataTypes.STRING(50),
      defaultValue: 'wildfires',
    },
    defaultView: {
      type: DataTypes.ENUM('map', 'timeline', 'stats'),
      defaultValue: 'stats',
    },
    defaultTimeRange: {
      type: DataTypes.STRING(10),
      defaultValue: '30d',
    },
  },
  {
    tableName: 'user_preferences',
    timestamps: true,
  }
);

module.exports = UserPreference;
