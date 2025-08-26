const { Sequelize } = require("sequelize");
require("dotenv").config();

const dialect = process.env.DB_DIALECT || "mysql";

let sequelize;
if (dialect === "sqlite") {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite",
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      dialect: dialect,
    }
  );
}

module.exports = sequelize;
