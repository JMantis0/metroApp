const router = require("express").Router();
const models = require("../models");
const env = require("dotenv");
const axios = require("axios");
const Sequelize = require("sequelize");

// apiKey = process.env.APIKEY;
// const db = require("../models");

// sheetjs xlsx
const XLSX = require("xlsx");
const metroBook = XLSX.readFile("./Master Car List.xlsx");
const sheet_name_list = metroBook.SheetNames;
const metroCarObject = XLSX.utils.sheet_to_json(metroBook.Sheets[sheet_name_list[0]])
console.log(metroCarObject.length)
console.log(metroCarObject[0]["Car #"]);

router.get("/test", (req, res) => {
  // Use a regular expression to search titles for req.query.q
  // using case insensitive match. https://docs.mongodb.com/manual/reference/operator/query/regex/index.html
  console.log("This is the test route");
  
  res.send(200);
});

router.post("/initializeDB", (req, res) => {

})

module.exports = router;
