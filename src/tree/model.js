const Sequelize = require("sequelize");
const sequelize = require("../db");

const Tree = sequelize.define(
  "tree",
  {
    type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    price: {
      type: Sequelize.DECIMAL,
      allowNull: false
    },
    locationX: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    locationY: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    price: {
      type: Sequelize.DECIMAL,
      allowNull: false
    }
  },

  {
    tableName: "trees"
  }
);

module.exports = Tree;
