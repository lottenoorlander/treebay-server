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
    }
  },

  {
    tableName: "trees"
  }
);

module.exports = Tree;
