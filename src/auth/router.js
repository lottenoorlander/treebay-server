const { Router } = require("express");
const { toJWT } = require("./jwt");
const router = new Router();
const bcrypt = require("bcrypt");
const Buyer = require("../buyer/model");
const Seller = require("../seller/model");
const Payment = require("../payments/model");

router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const isSeller = req.body.isSeller;

  if (!username || !password) {
    res.status(400).send({
      error_code: 3,
      message: "Please supply a valid username and password"
    });
  } else if (isSeller) {
    Seller.findOne({
      where: {
        username: req.body.username
      },
      include: [Payment]
    })
      .then(entity => {
        if (!entity) {
          res.status(400).send({
            error_code: 4,
            message: "User with that username and password does not exist"
          });
        } else if (bcrypt.compareSync(req.body.password, entity.password)) {
          res.send({
            jwt: toJWT({ userId: entity.id }),
            user: entity.username,
            id: entity.id,
            isSeller: true,
            stripeCode: entity.payment
          });
        } else {
          res.status(400).send({
            error_code: 4,
            message: "User with that username and password does not exist"
          });
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).send({
          error_code: 0,
          message: "Something went wrong with the server"
        });
      });
  } else {
    Buyer.findOne({
      where: {
        username: req.body.username
      }
    })
      .then(entity => {
        if (!entity) {
          res.status(400).send({
            error_code: 4,
            message: "User with that username and password does not exist"
          });
        } else if (bcrypt.compareSync(req.body.password, entity.password)) {
          res.send({
            jwt: toJWT({ userId: entity.id }),
            user: entity.username,
            id: entity.id,
            isSeller: false
          });
        } else {
          res.status(400).send({
            error_code: 4,
            message: "User with that username and password does not exist"
          });
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).send({
          error_code: 0,
          message: "Something went wrong with the server"
        });
      });
  }
});

module.exports = router;
