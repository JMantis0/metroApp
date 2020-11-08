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
const metroCarObject = XLSX.utils.sheet_to_json(
  metroBook.Sheets[sheet_name_list[0]]
);
console.log(metroCarObject);
console.log(metroCarObject[0]["num"]);

router.get("/test", (req, res) => {
  // Use a regular expression to search titles for req.query.q
  // using case insensitive match. https://docs.mongodb.com/manual/reference/operator/query/regex/index.html
  console.log("This is the test route");

  res.send(200);
});

router.post("/initializeDB", (req, res) => {
  console.log("initializing the db");

  models.Car.bulkCreate(metroCarObject)
    .then((response) => {
      console.log("response from MySQL initilize route", { response });
      res.send({ response });
    })
    .catch((err) => {
      console.log("There was an error in the initialize route: ", { err });
      res.status(400).send({ err });
    });
});

router.delete("/deleteDB", (req, res) => {
  console.log("Delete route apiRoutes.js)");
  models.Car.destroy({
    where: {},
    truncate: true,
  })
    .then((response) => {
      console.log("The response from MySQL is: ", { response });
      res.status(201).send({ response });
    })
    .catch((err) => {
      console.log("There was an error in the delete route: ", { err });
      res.status(400).send({ err });
    });
});

router.get("/getAllCars", (req, res) => {
  console.log("getAllCars route apiRoutes.js");
  models.Car.findAll({})
    .then((response) => {
      // console.log("getAllCars response from MySQL: ", response);
      res.status(202).send(response);
    })
    .catch((err) => {
      console.log("There was an error in the MySQL getAllCars route", err);
      res.status(400).send(err);
    });
});

router.get("/checkForNewData/:currentUTC", (req, res) => {
  console.log("Inside checkForNewData route: ", req.params.currentUTC);
  models.Car.findAll({ where: {} })
    .then((response) => {
      // console.log("Response[0] from MySQL in checkForNewData route: ", response[100]);
      res.status(200).send(response);
    })
    .catch((err) => {
      console.log(
        "There was an error in the mysql call in checkForNewData route: ",
        err
      );
      res.status(400).send(err);
    });
});

router.put("/toggleHeavy", (req, res) => {
  console.log("toggleHeavy route apiRoutes.js");
  console.log("req.body.num: ", req.body.num);
  models.Car.update(
    { heavy: req.body.newHeavy },
    {
      where: { num: req.body.num },
    }
  )
    .then((sqlResponse) => {
      console.log("sqlResponse toggleHeavy route: ", sqlResponse);
      res.status(201).send(sqlResponse);
    })
    .catch((sqlErr) => {
      console.log("There was an error in the toggleHeavy sql call: ", sqlErr);
      res.status(400).send(sqlErr);
    });
});

router.put("/toggleFlashers", (req, res) => {
  console.log("toggleFlashers route apiRoutes.js");
  console.log("req.body.num: ", req.body.num);
  models.Car.update(
    { flashers: req.body.newFlashers },
    {
      where: { num: req.body.num },
    }
  )
    .then((sqlResponse) => {
      console.log("sqlResponse toggleFlashers route: ", sqlResponse);
      res.status(201).send(sqlResponse);
    })
    .catch((sqlErr) => {
      console.log(
        "There was an error in the toggleFlashers sql call: ",
        sqlErr
      );
      res.status(400).send(sqlErr);
    });
});

router.put("/toggleKeys", (req, res) => {
  console.log("toggleKeys route apiRoutes.js");
  console.log("req.body.num: ", req.body.num);
  models.Car.update(
    { keyz: req.body.newKeys },
    {
      where: { num: req.body.num },
    }
  )
    .then((sqlResponse) => {
      console.log("sqlResponse toggleKeys route: ", sqlResponse);
      res.status(201).send(sqlResponse);
    })
    .catch((sqlErr) => {
      console.log("There was an error in the toggleKeys sql call: ", sqlErr);
      res.status(400).send(sqlErr);
    });
});

module.exports = router;
