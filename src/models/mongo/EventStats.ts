import mongoose from 'mongoose';
import { IEventStats } from '../../types';

const eventStatsSchema = new mongoose.Schema<IEventStats>(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    favoriteCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    lastViewedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const EventStats = mongoose.model<IEventStats>('EventStats', eventStatsSchema);

export default EventStats;
