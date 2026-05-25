// migrations/20260524000001-create-notifications.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
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
      },
      type: {
        type: Sequelize.ENUM('alert_triggered', 'event_update', 'system'),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      eventId: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      alertId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      isRead: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      readAt: {
        type: Sequelize.DATE,
        allowNull: true,
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

    await queryInterface.addIndex('notifications', ['userId']);
    await queryInterface.addIndex('notifications', ['userId', 'isRead']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('notifications');
  },
};
