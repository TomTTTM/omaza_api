'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Leads', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.UUID
      },
      created_time: {
        type: Sequelize.DATE
      },
      form_name: {
        type: Sequelize.STRING
      },
      service_requested: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      email: {
        type: Sequelize.STRING
      },
      full_name: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      post_code: {
        type: Sequelize.STRING
      },
      lead_status: {
        type: Sequelize.STRING
      },
      source: {
        type: Sequelize.STRING
      },
      raw_payload: {
        type: Sequelize.JSONB
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Leads');
  }
};