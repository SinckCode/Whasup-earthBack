import mongoose from 'mongoose';
import { ICategory } from '../../types';

const categorySchema = new mongoose.Schema<ICategory>(
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

const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category;
