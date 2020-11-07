const router = require("express").Router();
// const models = require("../models");
const env = require("dotenv");
const axios = require("axios");
const Sequelize = require("sequelize");

// apiKey = process.env.APIKEY;
// const db = require("../models");

router.get("/test", (req, res) => {
  // Use a regular expression to search titles for req.query.q
  // using case insensitive match. https://docs.mongodb.com/manual/reference/operator/query/regex/index.html
  console.log("This is the test route");

  res.send(200);
});

module.exports = router;
