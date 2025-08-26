const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT || 3306,
    logging: false,
  }
);

// Import models
const User = require("./user")(sequelize, DataTypes);
const Expense = require("./expense")(sequelize, DataTypes);
const Revenue = require("./revenue")(sequelize, DataTypes);

// Associations
User.hasMany(Expense, { foreignKey: "user_id", onDelete: "CASCADE" });
Expense.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Revenue, { foreignKey: "user_id", onDelete: "CASCADE" });
Revenue.belongsTo(User, { foreignKey: "user_id" });

module.exports = { sequelize, User, Expense, Revenue };
