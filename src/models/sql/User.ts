import { DataTypes } from 'sequelize';
import sequelize from '../../config/postgres';

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(2),
      allowNull: true,
      defaultValue: 'MX',
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user',
    },
    avatar: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  }
);

export default User;
