// src/models/Favorite.js
const { Schema, model, Types } = require('mongoose');

const favoriteSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // ID del evento en EONET (ej: "EONET_1234")
    eventId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String, // "wildfires", "earthquakes", etc.
      required: true,
    },
    link: {
      type: String,
    },
    coordinates: {
      type: [Number], // [lon, lat]
      default: undefined,
    },
    firstDate: {
      type: Date,
    },
    lastDate: {
      type: Date,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Evitar duplicados por usuario + evento
favoriteSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = model('Favorite', favoriteSchema);
