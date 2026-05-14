const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
      index: true,
    },
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
      type: String,
      required: true,
    },
    link: String,
    coordinates: {
      type: [Number],
    },
    firstDate: Date,
    lastDate: Date,
    note: {
      type: String,
      trim: true,
    },
    severity: Number,
    magnitude: Number,
  },
  { timestamps: true }
);

// Indice unico para evitar duplicados por usuario
favoriteSchema.index({ userId: 1, eventId: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
