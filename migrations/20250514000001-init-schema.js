// migrations/20250514000001-init-schema.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create users table
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      passwordHash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING(2),
      },
      role: {
        type: Sequelize.ENUM('user', 'admin'),
        defaultValue: 'user',
      },
      avatar: {
        type: Sequelize.STRING,
      },
      bio: {
        type: Sequelize.TEXT,
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      lastLoginAt: {
        type: Sequelize.DATE,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });

    // Create user_preferences table
    await queryInterface.createTable('UserPreferences', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      theme: {
        type: Sequelize.STRING,
        defaultValue: 'light',
      },
      defaultCategory: {
        type: Sequelize.STRING,
      },
      defaultView: {
        type: Sequelize.STRING,
      },
      defaultTimeRange: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });

    // Create alerts table
    await queryInterface.createTable('Alerts', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        index: true,
      },
      categorySlug: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      regions: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      countries: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      severityMin: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      notifyByEmail: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      lastTriggeredAt: {
        type: Sequelize.DATE,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });

    // Create regions table
    await queryInterface.createTable('Regions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        index: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      minLat: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      maxLat: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      minLon: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      maxLon: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      isDefault: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      color: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });

    // Create activity_logs table
    await queryInterface.createTable('ActivityLogs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        index: true,
      },
      action: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      meta: {
        type: Sequelize.JSONB,
      },
      ip: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
        index: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ActivityLogs');
    await queryInterface.dropTable('Regions');
    await queryInterface.dropTable('Alerts');
    await queryInterface.dropTable('UserPreferences');
    await queryInterface.dropTable('Users');
  },
};
