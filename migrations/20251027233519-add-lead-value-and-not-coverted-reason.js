"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Leads", "estimated_lifetime_value", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("Leads", "non_conversion_reason", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn("Leads", "estimated_lifetime_value", {
        transaction: t,
      });
      await queryInterface.removeColumn("Leads", "non_conversion_reason", {
        transaction: t,
      });
    });
  },
};
