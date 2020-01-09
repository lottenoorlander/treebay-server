const { Router } = require("express");
const Tree = require("./model");
const buyerAuth = require("../auth/buyerAuth");
const sellerAuth = require("../auth/sellerAuth");
router = new Router();

router.get("/trees", (req, res, next) => {
  const limit = req.query.limit || 0;
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

router.post("/trees", sellerAuth, (req, res, next) => {
  const { user } = req;
  const body = { ...req.body };

  if (!body.type || !body.price) {
    res.status(400).send({
      error_code: 5,
      message: "Please provide a type and price for the tree"
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
          message:
            "This is not your post and you are not authorized to edit this"
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

module.exports = router;
