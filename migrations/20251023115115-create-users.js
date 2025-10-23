"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Optional DB-side UUID defaults (requires pgcrypto)
    await queryInterface.sequelize
      .query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";')
      .catch(() => {});

    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },

      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      name: { type: Sequelize.STRING, allowNull: false },
      currency_id: { type: Sequelize.STRING(8), allowNull: false },
      time_zone_id: { type: Sequelize.STRING(64), allowNull: false },

      price_per_lead: { type: Sequelize.STRING, allowNull: false },
      recommended_price_per_lead: { type: Sequelize.STRING, allowNull: true },

      website: { type: Sequelize.STRING, allowNull: true },
      phone_number: { type: Sequelize.STRING, allowNull: false },
      phone_number_country_id: { type: Sequelize.STRING(8), allowNull: false },

      password: { type: Sequelize.STRING, allowNull: false },

      // Postgres arrays
      services: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
        defaultValue: [],
      },
      location_names: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
        defaultValue: [],
      },
      location_postal_codes: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: [],
      },

      max_monthly_customers: { type: Sequelize.INTEGER, allowNull: true },
      services_starting_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },

      business_name: { type: Sequelize.STRING, allowNull: true },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("users");
  },
};
