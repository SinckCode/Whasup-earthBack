// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');


const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const savedViewRoutes = require('./routes/savedViewRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

const app = express();

// Conexión a Mongo muy segura hard/soft
// Cambio extra
// Funcionando bien
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/saved-views', savedViewRoutes);
app.use('/api/favorites', favoriteRoutes);

app.get('/', (req, res) => {
  res.send('🌎 Whatsup-Earth API funcionando');
});

// Errores básicos
app.use((err, req, res, next) => {
  console.error('💥 Error global:', err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Whatsup-Earth API escuchando en el puerto ${PORT}`);
});
