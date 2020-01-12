const { Router } = require("express");
const Seller = require("../seller/model");
const Payments = require("../payments/model");
const { toData } = require("../auth/jwt");
const stripe = require("stripe")("sk_test_bh2V3QdidZqlMdH3PlNQOlja00WYLW4ylE");
const router = new Router();

router.get("/seller/onboarding", (req, res, next) => {
  // const stripeCode = req.query.code;
  const userCode = req.query.state;
  const data = toData(userCode);
  const userId = data.userId;

  stripe.oauth
    .token({
      grant_type: "authorization_code",
      code: stripeCode
    })
    .then(response => {
      Payments.create({ ...response, sellerId: userId });
    })
    .then(seller =>
      res.redirect("http://localhost:3000/seller/account/finishedsignup")
    )
    .catch(error =>
      res.status(500).send({
        error_code: error.error,
        message: error.error_description
      })
    );
});

module.exports = router;
