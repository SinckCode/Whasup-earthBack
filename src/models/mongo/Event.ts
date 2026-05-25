import mongoose from 'mongoose';
import { IEvent } from '../../types';

const eventSchema = new mongoose.Schema<IEvent>(
  {
    eonetId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    category: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
    magnitude: Number,
    startDate: {
      type: Date,
      index: true,
    },
    endDate: Date,
    source: {
      type: String,
      default: 'eonet',
    },
    country: {
      type: String,
      index: true,
    },
    region: String,
    cachedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Indice compuesto para queries comunes
eventSchema.index({ category: 1, startDate: -1 });

const Event = mongoose.model<IEvent>('Event', eventSchema);

export default Event;
