const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.PG_URI, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 2,
    idle: 10000,
  },
  retry: {
    max: 3,
  },
  define: {
    timestamps: true,
    underscored: false,
  },
});

module.exports = sequelize;
