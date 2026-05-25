/**
 * Seed script: creates test users and populates their notifications.
 *
 * Run inside Docker:
 *   docker compose exec -T backend node scripts/seed-test-users.js
 *
 * Or locally:
 *   PG_URI=postgres://whatsup:postgres123@localhost:5432/whatsup_earth node scripts/seed-test-users.js
 */

const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const PG_URI =
  process.env.PG_URI ||
  `postgres://${process.env.PG_USER || 'whatsup'}:${process.env.PG_PASSWORD || 'postgres123'}@${process.env.PG_HOST || 'postgres'}:${process.env.PG_PORT || 5432}/${process.env.PG_DB || 'whatsup_earth'}`;

const sequelize = new Sequelize(PG_URI, {
  dialect: 'postgres',
  logging: false,
});

// Minimal model definitions (match the real schema)
const User = sequelize.define('User', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email:        { type: DataTypes.STRING(255), unique: true, allowNull: false },
  passwordHash: { type: DataTypes.STRING(255), allowNull: false },
  name:         { type: DataTypes.STRING(100), allowNull: false },
  country:      { type: DataTypes.STRING(2), defaultValue: 'MX' },
  role:         { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' },
  avatar:       { type: DataTypes.STRING(500) },
  bio:          { type: DataTypes.TEXT },
  isVerified:   { type: DataTypes.BOOLEAN, defaultValue: false },
  lastLoginAt:  { type: DataTypes.DATE },
}, { tableName: 'users', timestamps: true });

const Notification = sequelize.define('Notification', {
  id:      { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:  { type: DataTypes.INTEGER, allowNull: false },
  type:    { type: DataTypes.ENUM('alert_triggered', 'event_update', 'system'), allowNull: false },
  title:   { type: DataTypes.STRING(255), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  eventId: { type: DataTypes.STRING(100) },
  alertId: { type: DataTypes.INTEGER },
  isRead:  { type: DataTypes.BOOLEAN, defaultValue: false },
  readAt:  { type: DataTypes.DATE },
}, { tableName: 'notifications', timestamps: true });

const TEST_USERS = [
  { name: 'María García',   email: 'maria@test.com',   country: 'MX' },
  { name: 'Carlos López',   email: 'carlos@test.com',  country: 'CO' },
  { name: 'Ana Rodríguez',  email: 'ana@test.com',     country: 'ES' },
];

const PASSWORD = 'Test1234';

async function main() {
  await sequelize.authenticate();
  console.log('✅ Conectado a PostgreSQL');

  const hash = await bcrypt.hash(PASSWORD, 10);
  const createdUsers = [];

  for (const u of TEST_USERS) {
    const [user, created] = await User.findOrCreate({
      where: { email: u.email },
      defaults: { ...u, passwordHash: hash },
    });
    createdUsers.push(user);
    console.log(`${created ? '🆕 Creado' : '⏩ Ya existe'}: ${u.name} (${u.email})`);
  }

  // Also fetch existing users to give them notifications
  const allUsers = await User.findAll();
  console.log(`\n📋 Total de usuarios: ${allUsers.length}`);

  // Build notifications for ALL users
  const now = new Date();
  const notifications = [];

  for (const user of allUsers) {
    const uid = user.getDataValue('id');
    const name = user.getDataValue('name');

    notifications.push(
      {
        userId: uid,
        type: 'system',
        title: '¡Bienvenido a WhatsUp Earth!',
        message: `Hola ${name}, gracias por registrarte. Explora eventos naturales en tiempo real, guarda tus favoritos y configura alertas personalizadas.`,
        isRead: false,
        createdAt: new Date(now - 3600000 * 24 * 3), // 3 days ago
        updatedAt: new Date(now - 3600000 * 24 * 3),
      },
      {
        userId: uid,
        type: 'event_update',
        title: 'Nuevo incendio forestal detectado',
        message: 'Se ha detectado un incendio forestal activo en la región del Pacífico Norte. Revisa el mapa para más detalles.',
        eventId: 'EONET_wildfires_2026',
        isRead: false,
        createdAt: new Date(now - 3600000 * 12), // 12 hours ago
        updatedAt: new Date(now - 3600000 * 12),
      },
      {
        userId: uid,
        type: 'alert_triggered',
        title: 'Alerta: Actividad sísmica elevada',
        message: 'Se ha registrado actividad sísmica significativa (magnitud 5.2+) en el Cinturón de Fuego del Pacífico.',
        eventId: 'STATS_earthquakes_2026_WORLD',
        isRead: false,
        createdAt: new Date(now - 3600000 * 6), // 6 hours ago
        updatedAt: new Date(now - 3600000 * 6),
      },
      {
        userId: uid,
        type: 'event_update',
        title: 'Tormenta severa actualizada',
        message: 'La tormenta tropical en el Caribe ha sido reclasificada a huracán categoría 2. Afecta regiones costeras de México y Cuba.',
        eventId: 'EONET_severe-storms_2026',
        isRead: false,
        createdAt: new Date(now - 3600000 * 2), // 2 hours ago
        updatedAt: new Date(now - 3600000 * 2),
      },
      {
        userId: uid,
        type: 'system',
        title: 'Tus estadísticas semanales',
        message: `${name}, esta semana se registraron 47 eventos naturales en tus regiones de interés. Revisa las estadísticas completas.`,
        isRead: true,
        readAt: new Date(now - 3600000),
        createdAt: new Date(now - 3600000 * 48), // 2 days ago
        updatedAt: new Date(now - 3600000),
      },
      {
        userId: uid,
        type: 'alert_triggered',
        title: 'Alerta: Erupción volcánica',
        message: 'El volcán Popocatépetl ha emitido una columna de ceniza de 3 km. Se recomienda precaución en zonas cercanas.',
        eventId: 'EONET_volcanoes_2026',
        isRead: false,
        createdAt: new Date(now - 3600000), // 1 hour ago
        updatedAt: new Date(now - 3600000),
      },
    );
  }

  // Clear existing notifications and insert fresh ones
  await Notification.destroy({ where: {} });
  await Notification.bulkCreate(notifications);

  console.log(`\n🔔 Creadas ${notifications.length} notificaciones para ${allUsers.length} usuarios`);
  console.log('\n📝 Credenciales de usuarios de prueba:');
  for (const u of TEST_USERS) {
    console.log(`   ${u.email} / ${PASSWORD}`);
  }

  await sequelize.close();
  console.log('\n✅ Seed completado');
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
