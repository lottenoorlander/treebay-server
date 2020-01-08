const { Router } = require("express");
const bcrypt = require("bcrypt");
const User = require("./model");
const auth = require("../auth/middleware");
const router = new Router();

router.post("/user", (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send({
      error_code: 1,
      message: "Please supply a valid username and password"
    });
  } else {
    User.findOne({
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
          const user = {
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 10)
          };

          User.create(user)
            .then(user => res.send(user))
            .catch(error =>
              res.status(500).send({
                error_code: 0,
                message: "Something went wrong with the server"
              })
            );
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

router.put("/user", auth, (req, res, next) => {
  const { user } = req;

  User.findByPk(user.id)
    .then(user => {
      user
        .update(req.body)
        .then(user => res.send(user))
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

router.delete("/user", auth, (req, res, next) => {
  const { user } = req;

  User.findByPk(user.id)
    .then(user => {
      User.destroy({ where: { id: user.id } })
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

module.exports = router;
