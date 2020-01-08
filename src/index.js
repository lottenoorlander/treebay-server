const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

const cors = require("cors");
const corsMiddleware = cors();
app.use(corsMiddleware);

const bodyParser = require("body-parser");
const bodyParserMiddleWare = bodyParser.json();
app.use(bodyParserMiddleWare);

app.get("/", (req, res) => res.send("Welcome to Treebay!"));

app.listen(port, () => console.log(`Listening on port ${port}!`));
