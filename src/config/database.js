require("dotenv").config();
const { Sequelize } = require("sequelize");

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.warn("[WARN] DATABASE_URL is not set.");
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  dialectOptions: {
    ssl:
      process.env.DATABASE_SSL === "true"
        ? { require: true, rejectUnauthorized: false }
        : undefined,
  },
});

module.exports = { sequelize };
