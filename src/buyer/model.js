const Sequelize = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define(
  "user",
  {
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: "users"
  }
);

module.exports = User;
