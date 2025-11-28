// src/models/User.js
const { Schema, model } = require('mongoose');

const preferencesSchema = new Schema(
  {
    theme: {
      type: String,
      enum: ['dark', 'light'],
      default: 'dark',
    },
    defaultCategory: {
      type: String,
      default: 'wildfires', // clave de tu constants.js
    },
    defaultView: {
      type: String,
      enum: ['map', 'timeline', 'stats'],
      default: 'stats',
    },
    defaultTimeRange: {
      type: String,
      default: '30d', // 7d, 30d, 1y...
    },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      default: 'MX',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    preferences: {
      type: preferencesSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const User = model('User', userSchema);

module.exports = User;
