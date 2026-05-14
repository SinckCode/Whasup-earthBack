// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const connectDB = require('./config/db');
const sequelize = require('./config/postgres');
const { authLimiter, apiLimiter } = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const savedViewRoutes = require('./routes/savedViewRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const alertRoutes = require('./routes/alertRoutes');
const regionRoutes = require('./routes/regionRoutes');
const eventRoutes = require('./routes/eventRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const activityRoutes = require('./routes/activityRoutes');

const app = express();

// Inicializar bases de datos
async function initDB() {
  try {
    await connectDB();
    console.log('✅ MongoDB conectado');

    await sequelize.authenticate();
    console.log('✅ PostgreSQL conectado');

    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Modelos sincronizados');
  } catch (err) {
    console.error('❌ Error inicializando BD:', err);
    process.exit(1);
  }
}

// Security middlewares
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());

// Rate limiting
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: '🌎 WhatsUp-Earth API',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/saved-views', savedViewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/regions', regionRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/activity', activityRoutes);

// Error handler (debe ser el último middleware)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

async function start() {
  await initDB();

  app.listen(PORT, () => {
    console.log(`🚀 WhatsUp-Earth API escuchando en puerto ${PORT}`);
    console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  });
}

start().catch(err => {
  console.error('❌ Error iniciando servidor:', err);
  process.exit(1);
});
