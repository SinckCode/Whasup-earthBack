// seeders/01-categories.js
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../src/models/mongo/Category');

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://192.168.100.109:27017/whatsup_earth';

async function seedCategories() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('📦 Conectado a MongoDB para seeders');

    const existingCount = await Category.countDocuments();
    if (existingCount > 0) {
      console.log(`⏭️  Ya existen ${existingCount} categorías. Saltando seeder.`);
      await mongoose.disconnect();
      process.exit(0);
    }

    const categories = [
      {
        slug: 'wildfires',
        name: 'Wildfires',
        eonetId: '8',
        description: 'Active fire events across the globe',
        icon: '🔥',
        color: '#FF6B35',
        isActive: true,
      },
      {
        slug: 'earthquakes',
        name: 'Earthquakes',
        eonetId: '12',
        description: 'Seismic activities and earthquakes',
        icon: '🌍',
        color: '#FF0000',
        isActive: true,
      },
      {
        slug: 'floods',
        name: 'Floods',
        eonetId: '5',
        description: 'Flood events and water-related disasters',
        icon: '🌊',
        color: '#0066CC',
        isActive: true,
      },
      {
        slug: 'volcanic-activity',
        name: 'Volcanic Activity',
        eonetId: '12',
        description: 'Volcanic eruptions and volcanic activities',
        icon: '🌋',
        color: '#8B4513',
        isActive: true,
      },
      {
        slug: 'extreme-weather',
        name: 'Extreme Weather',
        eonetId: '11',
        description: 'Hurricanes, tornadoes, and severe storms',
        icon: '⛈️',
        color: '#FFB300',
        isActive: true,
      },
      {
        slug: 'landslides',
        name: 'Landslides',
        eonetId: '10',
        description: 'Landslide and avalanche events',
        icon: '⛰️',
        color: '#8B7355',
        isActive: true,
      },
      {
        slug: 'drought',
        name: 'Drought',
        eonetId: '3',
        description: 'Drought conditions and water scarcity',
        icon: '🏜️',
        color: '#D4A574',
        isActive: true,
      },
    ];

    const result = await Category.insertMany(categories);
    console.log(`✅ ${result.length} categorías creadas exitosamente`);

    await mongoose.disconnect();
    console.log('✅ Seeder completado');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en seeder:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedCategories();
