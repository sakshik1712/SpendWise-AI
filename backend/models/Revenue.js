const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Revenue = sequelize.define("Revenue", {
  title: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false }
});

module.exports = Revenue;