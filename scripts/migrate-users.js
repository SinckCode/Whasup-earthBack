// scripts/migrate-users.js
require('dotenv').config();
const mongoose = require('mongoose');
const sequelize = require('../src/config/postgres');
const { User, UserPreference } = require('../src/models/sql');

// MongoDB User model
const mongoUserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    password: String,
    name: String,
    country: String,
    avatar: String,
    bio: String,
    isVerified: { type: Boolean, default: false },
    role: { type: String, default: 'user' },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://192.168.100.109:27017/whatsup_earth';

async function migrateUsers() {
  let mongoConnection = null;

  try {
    // Connect to MongoDB
    mongoConnection = await mongoose.connect(MONGO_URI);
    const MongoUser = mongoose.model('User', mongoUserSchema, 'users');
    console.log('✅ Conectado a MongoDB');

    // Connect to PostgreSQL
    await sequelize.authenticate();
    console.log('✅ Conectado a PostgreSQL');

    // Sync tables
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos PostgreSQL sincronizados');

    // Get all MongoDB users
    const mongoUsers = await MongoUser.find({});
    console.log(`📦 Encontrados ${mongoUsers.length} usuarios en MongoDB`);

    if (mongoUsers.length === 0) {
      console.log('⏭️  No hay usuarios para migrar');
      await mongoose.disconnect();
      await sequelize.close();
      process.exit(0);
    }

    let migratedCount = 0;
    let skippedCount = 0;

    for (const mongoUser of mongoUsers) {
      try {
        // Check if user already exists in PostgreSQL
        const existing = await User.findOne({
          where: { email: mongoUser.email },
        });

        if (existing) {
          console.log(
            `⏭️  Usuario ${mongoUser.email} ya existe en PostgreSQL. Saltando.`
          );
          skippedCount++;
          continue;
        }

        // Create user in PostgreSQL
        const pgUser = await User.create({
          email: mongoUser.email,
          passwordHash: mongoUser.password, // Ideally should be re-hashed
          name: mongoUser.name || 'User',
          country: mongoUser.country,
          avatar: mongoUser.avatar,
          bio: mongoUser.bio,
          isVerified: mongoUser.isVerified || false,
          role: mongoUser.role || 'user',
          lastLoginAt: mongoUser.lastLoginAt,
        });

        // Create user preferences with defaults
        await UserPreference.create({
          userId: pgUser.id,
          theme: 'light',
          defaultCategory: null,
          defaultView: 'map',
          defaultTimeRange: '7d',
        });

        console.log(`✅ Usuario ${mongoUser.email} migrado con ID ${pgUser.id}`);
        migratedCount++;
      } catch (err) {
        console.error(
          `❌ Error migrando usuario ${mongoUser.email}:`,
          err.message
        );
      }
    }

    console.log(`\n📊 Resumen de migración:`);
    console.log(`   - Usuarios migrados: ${migratedCount}`);
    console.log(`   - Usuarios saltados: ${skippedCount}`);
    console.log(
      `   - Total procesado: ${migratedCount + skippedCount}/${mongoUsers.length}`
    );

    await mongoose.disconnect();
    await sequelize.close();
    console.log('\n✅ Migración completada');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en migración:', err.message);
    if (mongoConnection) {
      await mongoose.disconnect();
    }
    if (sequelize) {
      await sequelize.close();
    }
    process.exit(1);
  }
}

migrateUsers();
