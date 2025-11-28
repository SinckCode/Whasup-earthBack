// src/models/SavedView.js
const { Schema, model, Types } = require('mongoose');

const savedViewSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    // Filtros que usarás en tu frontend
    filters: {
      categories: [String],    // ["wildfires"]
      countries: [String],     // ["Mexico", "United States"]
      dateRange: {
        type: {
          type: String,        // "lastDays", "lastMonths", etc.
          default: 'lastDays',
        },
        value: {
          type: Number,        // 7, 30, 365...
          default: 30,
        },
      },
      severity: {
        min: { type: Number, default: null },
        max: { type: Number, default: null },
      },
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = model('SavedView', savedViewSchema);
