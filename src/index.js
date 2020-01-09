const express = require("express");
const app = express();
const buyerRouter = require("./buyer/router");
const sellerRouter = require("./seller/router");
const authRouter = require("./auth/router");
const treeRouter = require("./tree/router");
const port = process.env.PORT || 4000;

const cors = require("cors");
const corsMiddleware = cors();
app.use(corsMiddleware);

const bodyParser = require("body-parser");
const bodyParserMiddleWare = bodyParser.json();
app.use(bodyParserMiddleWare);

app.get("/", (req, res) => res.send("Welcome to Treebay!"));
app.use(sellerRouter);
app.use(buyerRouter);
app.use(authRouter);
app.use(treeRouter);

app.listen(port, () => console.log(`Listening on port ${port}!`));
