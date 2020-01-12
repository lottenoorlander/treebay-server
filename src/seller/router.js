const { Router } = require("express");
const bcrypt = require("bcrypt");
const Seller = require("./model");
const auth = require("../auth/sellerAuth");
const { toData } = require("../auth/jwt");
const router = new Router();

router.post("/seller", (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send({
      error_code: 1,
      message: "Please supply a valid username and password"
    });
  } else {
    Seller.findOne({
      where: {
        username: req.body.username
      }
    })
      .then(entity => {
        if (entity) {
          return res.status(400).send({
            error_code: 2,
            message: "User with this username already exists"
          });
        } else {
          const seller = {
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 10)
          };

          Seller.create(seller)
            .then(seller => res.send(seller))
            .catch(error => next(error));
        }
      })
      .catch(error =>
        res.status(500).send({
          error_code: 0,
          message: "Something went wrong with the server"
        })
      );
  }
});

router.put("/seller", auth, (req, res, next) => {
  const { seller } = req;

  Seller.findByPk(seller.id)
    .then(seller => {
      seller
        .update(req.body)
        .then(seller => res.send(seller))
        .catch(err =>
          res.status(500).send({
            error_code: 0,
            message: "Something went wrong with the server"
          })
        );
    })
    .catch(err =>
      res.status(500).send({
        error_code: 0,
        message: "Something went wrong with the server"
      })
    );
});

router.delete("/seller", auth, (req, res, next) => {
  const { seller } = req;

  Seller.findByPk(seller.id)
    .then(seller => {
      Seller.destroy({ where: { id: seller.id } })
        .then(number => res.send({ number }))
        .catch(error =>
          res.status(500).send({
            error_code: 0,
            message: "Something went wrong with the server"
          })
        );
    })
    .catch(err =>
      res.status(500).send({
        error_code: 0,
        message: "Something went wrong with the server"
      })
    );
});

router.get("/seller/onboarding", (req, res, next) => {
  const stripeCode = req.query.code;
  const userCode = req.query.state;
  const data = toData(userCode);

  Seller.findByPk(data.userId).then(user => {
    if (!user) {
      return next("User does not exist");
    } else {
      user
        .update({ stripeCode: stripeCode })
        .then(seller =>
          res.redirect("http://localhost:3000/seller/account/finishedsignup")
        )
        .catch(err =>
          res.status(500).send({
            error_code: 0,
            message: "Something went wrong with the server"
          })
        );
    }
  });
});

module.exports = router;
