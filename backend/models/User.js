// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); 

const User = sequelize.define("User", {
  name: { type: DataTypes.STRING, allowNull: false, defaultValue: "User" },
  avatar: { type: DataTypes.STRING, allowNull: true },
  budget: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 }
}, {
  timestamps: true,       
  freezeTableName: true   
});

module.exports = User;
