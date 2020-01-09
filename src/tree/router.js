const { Router } = require("express");
const Tree = require("./model");
const auth = require("../auth/middleware");
router = new Router();

router.get("/trees", (req, res, next) => {
  const limit = req.query.limit || 0;
  const offset = req.query.offset || 0;

  //   return Tree.findAndCountAll({ where: { buyerId: null }, limit, offset})
  return Tree.findAndCountAll()
    .then(result => res.send({ trees: result.rows, total: result.count }))
    .catch(err =>
      res.status(500).send({
        error_code: 0,
        message: "Something went wrong with the server"
      })
    );
});

router.post("/trees", (req, res, next) => {
  //   const { user } = req;
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
          message: "Something went wrong"
        })
      );
  }
});

module.exports = router;
