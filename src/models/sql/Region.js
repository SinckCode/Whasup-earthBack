const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgres');

const Region = sequelize.define(
  'Region',
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    minLat: {
      type: DataTypes.REAL,
      allowNull: false,
    },
    maxLat: {
      type: DataTypes.REAL,
      allowNull: false,
    },
    minLon: {
      type: DataTypes.REAL,
      allowNull: false,
    },
    maxLon: {
      type: DataTypes.REAL,
      allowNull: false,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    color: {
      type: DataTypes.STRING(7),
      defaultValue: '#3B82F6',
    },
  },
  {
    tableName: 'regions',
    timestamps: true,
    indexes: [{ fields: ['userId'] }],
  }
);

module.exports = Region;
