"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // The 'up' function is run when the migration is applied (migrated)
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(
      "Leads", // Name of the table you're updating
      "lead_summary", // Name of the new column
      {
        type: Sequelize.TEXT, // Data type (use TEXT for potentially long strings)
        allowNull: true, // Specify if the column can be null
        // You can add other options like defaultValue, etc.
      }
    );
  },

  // The 'down' function is run when the migration is reverted (undo)
  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn(
      "Leads", // Name of the table
      "lead_summary" // Name of the column to remove
    );
  },
};
