const { Router } = require("express");
const { toJWT } = require("./jwt");
const router = new Router();
const bcrypt = require("bcrypt");
const Buyer = require("../buyer/model");
const Seller = require("../seller/model");

router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const sellerOrBuyer = req.body.sellerOrBuyer;

  if (!username || !password) {
    rses.status(400).send({
      error_code: 3,
      message: "Please supply a valid username and password"
    });
  } else {
    [sellerOrBuyer]
      .findOne({
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
            user: entity.username
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
