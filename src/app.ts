// src/app.ts
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import connectDB from './config/db';
import sequelize from './config/postgres';
import { authLimiter, apiLimiter } from './middlewares/rateLimiter';
import errorHandler from './middlewares/errorHandler';

// Routes
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import savedViewRoutes from './routes/savedViewRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import alertRoutes from './routes/alertRoutes';
import regionRoutes from './routes/regionRoutes';
import eventRoutes from './routes/eventRoutes';
import categoryRoutes from './routes/categoryRoutes';
import activityRoutes from './routes/activityRoutes';
import notificationRoutes from './routes/notificationRoutes';
import commentRoutes from './routes/commentRoutes';
import eventStatsRoutes from './routes/eventStatsRoutes';

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
app.use('/api/notifications', notificationRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/event-stats', eventStatsRoutes);

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
