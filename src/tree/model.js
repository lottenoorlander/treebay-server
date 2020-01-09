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
    location: {
      type: Sequelize.GEOGRAPHY,
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

module.exports = User;
