const express = require("express");
const app = express();
const userRouter = require("./user/router");
const port = process.env.PORT || 4000;

const cors = require("cors");
const corsMiddleware = cors();
app.use(corsMiddleware);

const bodyParser = require("body-parser");
const bodyParserMiddleWare = bodyParser.json();
app.use(bodyParserMiddleWare);

app.get("/", (req, res) => res.send("Welcome to Treebay!"));
app.use(userRouter);

app.listen(port, () => console.log(`Listening on port ${port}!`));
