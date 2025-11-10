"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("users", "services_starting_price", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // revert back to DECIMAL(10,2)
    await queryInterface.changeColumn("users", "services_starting_price", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });
  },
};
