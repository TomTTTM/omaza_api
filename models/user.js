// models/user.js
"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    async checkPassword(plain) {
      return bcrypt.compare(plain, this.password);
    }
    static associate(models) {
      // e.g., User.hasMany(models.Lead, { foreignKey: 'user_id' });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      name: { type: DataTypes.STRING, allowNull: false },
      currency_id: { type: DataTypes.STRING(8), allowNull: false },
      time_zone_id: { type: DataTypes.STRING(64), allowNull: false },

      price_per_lead: { type: DataTypes.STRING, allowNull: false },
      recommended_price_per_lead: { type: DataTypes.STRING, allowNull: true },

      website: { type: DataTypes.STRING, allowNull: true },
      phone_number: { type: DataTypes.STRING, allowNull: false },
      phone_number_country_id: { type: DataTypes.STRING(8), allowNull: false },

      password: { type: DataTypes.STRING, allowNull: false },
      ref: { type: DataTypes.STRING, allowNull: true },

      // Postgres arrays
      services: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      location_names: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      location_postal_codes: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },

      max_monthly_customers: { type: DataTypes.INTEGER, allowNull: true },
      services_starting_price: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      business_name: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      indexes: [{ unique: true, fields: ["email"] }],
      hooks: {
        async beforeCreate(user) {
          if (user.password)
            user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
        },
        async beforeUpdate(user) {
          if (user.changed("password"))
            user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
        },
      },
    }
  );

  return User;
};
