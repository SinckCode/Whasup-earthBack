const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    eonetId: {
      type: String,
      required: true,
    },
    description: String,
    icon: String,
    color: {
      type: String,
      default: '#3B82F6',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
