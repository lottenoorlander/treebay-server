const { Router } = require("express");
const { toData } = require("../auth/jwt");
const sellerAuth = require("../auth/sellerAuth");
const buyerAuth = require("../auth/buyerAuth");
const Payments = require("../payments/model");
const Tree = require("../tree/model");
const stripe = require("stripe")("sk_test_bh2V3QdidZqlMdH3PlNQOlja00WYLW4ylE");
const router = new Router();

router.get("/seller/onboarding", (req, res, next) => {
  const stripeCode = req.query.code;
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

router.get("/seller/stripedashboard", sellerAuth, (req, res, next) => {
  const { user } = req;
  Payments.findOne({ where: { sellerId: user.id } }).then(paymentDetails => {
    const CONNECTED_STRIPE_ACCOUNT_ID = paymentDetails.stripe_user_id;
    return stripe.accounts.createLoginLink(
      CONNECTED_STRIPE_ACCOUNT_ID,
      function(err, link) {
        err ? res.status(500).send({ err }) : res.send(link);
      }
    );
  });
});

router.post("/checkout", buyerAuth, async (req, res, next) => {
  ////needs to check if tree in question is already reserverd, if not set to reserve
  //should set tree to reserved
  const tree = await Tree.findOne({ where: { id: req.body.id } });
  const seller = await Payments.findOne({
    where: { sellerId: tree.sellerId }
  });
  const stripeAccount = seller.stripe_user_id;
  const price = tree.price * 100;
  const session = await stripe.checkout.sessions.create(
    {
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          name: tree.type,
          amount: price,
          currency: "eur",
          quantity: 1
        }
      ],
      payment_intent_data: {
        application_fee_amount: 200
      },
      success_url: `http://localhost:4000/success?id=${req.body.id}&buyer=${req.user.id}`,
      cancel_url: `http://localhost:4000/cancel?id=${req.body.id}`
    },
    {
      stripeAccount: stripeAccount
    }
  );
  res.send(session);
});

router.get("/success", (req, res, next) => {
  const id = req.query.id;
  const buyer = req.query.buyer;
  console.log("its getting the endpoint", id, buyer);
  Tree.findOne({ where: { id: id } }).then(tree =>
    tree
      .update({ buyerId: buyer })
      .then(tree => res.redirect(`http://localhost:3000/trees/${id}/success`))
      .catch(error =>
        res.status(500).send({
          error_code: error.error,
          message: error.error_description
        })
      )
  );
});

router.get("/cancel", (req, res, next) => {
  // req.id is the tree that needs to be updated as not being reserved anymore
  res.redirect(`http://localhost:3000/trees/${req.query.id}/cancel`);
});

module.exports = router;
