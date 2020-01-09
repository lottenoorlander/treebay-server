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

module.exports = router;
