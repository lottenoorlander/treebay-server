const Sequelize = require("sequelize");
const sequelize = require("../db");

const Payment = sequelize.define(
  "payment",
  {
    access_token: {
      type: Sequelize.STRING,
      allowNull: false
    },
    livemode: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    refresh_token: {
      type: Sequelize.STRING,
      allowNull: false
    },
    token_type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    stripe_publishable_key: {
      type: Sequelize.STRING,
      allowNull: false
    },
    stripe_user_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    scope: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: "payments"
  }
);

module.exports = Payment;
