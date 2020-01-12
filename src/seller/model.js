const Sequelize = require("sequelize");
const sequelize = require("../db");

const Seller = sequelize.define(
  "seller",
  {
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    stripeCode: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  {
    timestamps: false,
    tableName: "sellers"
  }
);

module.exports = Seller;
