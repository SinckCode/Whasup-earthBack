const mongoose = require('mongoose');

const savedViewSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
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
    filters: {
      categories: [String],
      countries: [String],
      dateRange: {
        type: {
          type: String,
          default: 'lastDays',
        },
        value: {
          type: Number,
          default: 30,
        },
      },
      severity: {
        min: { type: Number, default: null },
        max: { type: Number, default: null },
      },
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const SavedView = mongoose.model('SavedView', savedViewSchema);

module.exports = SavedView;
