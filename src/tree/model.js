const Sequelize = require("sequelize");
const sequelize = require("../db");
const Buyer = require("../buyer/model");
const Seller = require("../seller/model");
const Payment = require("../payments/model");

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
      allowNull: false
    },
    locationY: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    img: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },

  {
    tableName: "trees"
  }
);

Tree.belongsTo(Buyer);
Buyer.hasMany(Tree);

Tree.belongsTo(Seller);
Seller.hasMany(Tree);

Payment.belongsTo(Seller);
Seller.hasOne(Payment);

module.exports = Tree;
