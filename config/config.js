// config/config.js
require("dotenv").config();

const ssl =
  process.env.DATABASE_SSL === "true"
    ? { require: true, rejectUnauthorized: false }
    : undefined;

module.exports = {
  development: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: { ssl },
  },
  test: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: { ssl },
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: { ssl },
  },
};
