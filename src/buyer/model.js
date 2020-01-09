const Sequelize = require("sequelize");
const sequelize = require("../db");

const Buyer = sequelize.define(
  "buyer",
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
    tableName: "buyers"
  }
);

module.exports = Buyer;
