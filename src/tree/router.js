const { Router } = require("express");
const Tree = require("./model");
const buyerAuth = require("../auth/buyerAuth");
const sellerAuth = require("../auth/sellerAuth");
const Seller = require("../seller/model");
const request = require("superagent");
router = new Router();

router.get("/trees", (req, res, next) => {
  const limit = req.query.limit || 25;
  const offset = req.query.offset || 0;

  return Tree.findAndCountAll({ where: { buyerId: null }, limit, offset })
    .then(result => res.send({ trees: result.rows, total: result.count }))
    .catch(err =>
      res.status(500).send({
        error_code: 0,
        message: "Something went wrong with the server"
      })
    );
});

router.post("/trees", sellerAuth, async (req, res, next) => {
  const { user } = req;
  const body = { ...req.body, sellerId: user.id };

  const address = body.location.replace(/ /g, "+");
  console.log(address);
  const locationInfo = await request.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyAOis1sZ9s2092YSGZ3EyeRnB0VWi3wzX0`
  );
  body.locationY = locationInfo.body.results[0].geometry.location.lng;
  body.locationX = locationInfo.body.results[0].geometry.location.lat;

  if (
    !body.type ||
    !body.price ||
    !body.description ||
    !body.img ||
    !body.locationY ||
    !body.locationX
  ) {
    res.status(400).send({
      error_code: 5,
      message: "Please fill in all items"
    });
  } else {
    Tree.create(body)
      .then(tree => res.send(tree))
      .catch(err =>
        res.status(500).send({
          error_code: 0,
          message: "Something went wrong with the server"
        })
      );
  }
});

router.get("/tree/:id", (req, res, next) =>
  Tree.findByPk(req.params.id)
    .then(tree => res.send(tree))
    .catch(err =>
      res.status(500).send({
        error_code: 0,
        message: "Something went wrong with the server"
      })
    )
);

router.put("/tree/:id", sellerAuth, (req, res, next) => {
  const { user } = req;

  Tree.findByPk(req.params.id)
    .then(tree => {
      if (tree.sellerId === user.id && !tree.buyerId) {
        tree
          .update(req.body)
          .then(tree => res.send(tree))
          .catch(err =>
            res.status(500).send({
              error_code: 0,
              message: "Something went wrong with the server"
            })
          );
      } else {
        res.status(400).send({
          error_code: 6,
          message: "You are not allowed to edit this post"
        });
      }
    })
    .catch(err =>
      res.status(500).send({
        error_code: 0,
        message: "Something went wrong with the server"
      })
    );
});

router.delete("/tree/:id", sellerAuth, (req, res, next) => {
  const { user } = req;

  Tree.findByPk(req.params.id)
    .then(tree => {
      if (tree.sellerId === user.id && !tree.buyerId) {
        Tree.destroy({ where: { id: req.params.id } })
          .then(number => res.send({ number }))
          .catch(err =>
            res.status(500).send({
              error_code: 0,
              message: "Something went wrong with the server"
            })
          );
      } else {
        res.status(400).send({
          error_code: 7,
          message: "You are not allowed to delete this post"
        });
      }
    })
    .catch(err =>
      res.status(500).send({
        error_code: 0,
        message: "Something went wrong with the server"
      })
    );
});

router.get("/trees/bought", buyerAuth, (req, res, next) => {
  const { user } = req;
  Tree.findAll({ where: { buyerId: user.id } }, { include: [Seller] })
    .then(result => res.send(result))
    .catch(err =>
      res.status(500).send({
        error_code: 0,
        message: "Something went wrong with the server"
      })
    );
});

router.get("/trees/sold", sellerAuth, (req, res, next) => {
  const { user } = req;
  Tree.findAll({ where: { sellerId: user.id } }, { include: [Buyer] })
    .then(result => res.send(result))
    .catch(err =>
      res.status(500).send({
        error_code: 0,
        message: "Something went wrong with the server"
      })
    );
});

module.exports = router;
