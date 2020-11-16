const router = require("express").Router();
const models = require("../models");
const env = require("dotenv");
const axios = require("axios");
const Sequelize = require("sequelize");
const moment = require("moment");
moment().format();
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
console.log(
  "********** HELLO  ***********\n**** YOU ARE DEVELOPING ******\n**** METRO APP, JESSE!! ******"
);

const updateLatestPut = (res) => {
  const response = new Promise((resolve, reject) => {
    models.LatestPut.update(
      { latestPut: moment().toString() },
      { where: { id: 1 } }
    )
      .then((response) => {
        console.log("response from latestPut update", response);
        resolve(response);
      })
      .catch((latestPutSQLErr) => {
        console.log("Error in the latestPut call: ", latestPutSQLErr);
        console.log("-----------------------------------------");
        reject(latestPutSQLErr);
      });
  }).catch((promiseError) => {
    console.log("There was a promise error: ", promiseError);
    res.status(400).send(promiseError);
  });
  console.log("response from updateLatestPut", response);
  return response;
};

//  This route will be used by each MetroCar individually to reduce mass renders
router.get("/updateMetroCar/:carNumber", (req, res) => {
  models.Car.findOne({ where: { num: req.params.carNumber } })
    .then((car) => {
      console.log("Car found: ", car);
      res.status(202).send(car);
    })
    .catch((updateCarError) => {
      console.log(
        "There was an error in the updateMetroCar route: ",
        updateCarError
      );
      res.status(400).send(updateCarError);
    });
});

router.put("/testLatestPut", (req, res) => {
  updateLatestPut(res).then((response) => {
    console.log("42updateLatestPut response", response);
    res.status(202).send(response);
  });
});

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

router.get("/getCarNumbers", (req, res) => {
  console.log("getCarNumbers route apiRoutes.js");
  models.Car.findAll({})
    //finds the whole set
    .then((allCars) => {
      // console.log("getCarNumbers response from MySQL: ", allCars);

      const carObject = {};

      allCars.forEach((car) => {
        carObject[car.dataValues.num] = {
          number: car.dataValues.num,
          volume: car.dataValues.volume,
          keys: car.dataValues.keyz,
          updatedAt: car.dataValues.updatedAt,
        };
      });
      console.log("numbers array is !!!!: ", carObject);
      res.status(202).send(carObject);
    })
    .catch((err) => {
      console.log("There was an error in the MySQL getCarNumbers route", err);
      res.status(400).send(err);
    });
});

router.get("/checkForNewData/:lastStateUpdateTime", (req, res) => {
  // https://momentjs.com/docs/#/parsing/string-format/
  //  Timestamp from front end
  console.log("**********************");
  console.log("timestamp from client", req.params.lastStateUpdateTime);
  const frontEndMoment = moment.unix(req.params.lastStateUpdateTime);
  console.log("moment created with timestamp", frontEndMoment);

  //  I want to compare this timestamp to the most recent updatedAt
  models.LatestPut.findAll({ where: { id: 1 } })
    .then((response) => {
      const updatedAtMoment = moment(response[0].dataValues.updatedAt);
      console.log(`frontEndMoment ${frontEndMoment}`);
      console.log(`updatedAtMoment ${updatedAtMoment}`);
      console.log(frontEndMoment.diff(updatedAtMoment, "seconds"));
      if (frontEndMoment.diff(updatedAtMoment, "seconds") < 0) {
        console.log(
          `There is new data that was added ${-frontEndMoment.diff(
            updatedAtMoment,
            "seconds"
          )} seconds after our last state update`
        );
        res.status(200).send({ newData: true });
      } else {
        console.log("There is no new data");
        console.log(
          `The newest data is from ${updatedAtMoment}, which is ${frontEndMoment.diff(
            updatedAtMoment,
            "seconds"
          )} seconds older than our last update`
        );
        res.status(200).send({ newData: false });
      }
    })
    .catch((err) => {
      console.log(
        "There was an error in the mysql call in checkForNewData route: ",
        err
      );
      res.status(400).send(err);
    });
});

router.get("/getOutOfDateCars/:lastStateUpdateTime", (req, res) => {
  const lastStateUpdateTime = req.params.lastStateUpdateTime;
  models.Car.findAll({})
    .then((allCars) => {
      const carsToBeUpdated = [];
      allCars.forEach((car) => {
        const carUpdatedAtInUnix = moment(car.dataValues.updatedAt).unix();
        if (lastStateUpdateTime < carUpdatedAtInUnix) {
          // console.log(
          //   `Car ${car.dataValues.num} is out of date and has  new data in the db`
          // );
          carsToBeUpdated.push(car.dataValues.num);
        }
        // else {
        // console.log(`Car ${car.dataValues.num} is already up to date`);
        // }
      });
      console.log("carsToBeUpdated: ", carsToBeUpdated);
      res.status(200).send(carsToBeUpdated);
    })
    .catch((error) => {
      console.log("There was an error: ", error);
      res.status(400).send(error);
    });
});

//  DEPRECATED 11/14/2020
// router.put("/toggleHeavy", (req, res) => {
//   console.log("toggleHeavy route apiRoutes.js");
//   console.log("req.body.num: ", req.body.num);
//   models.Car.update(
//     { heavy: req.body.newHeavy },
//     {
//       where: { num: req.body.num },
//     }
//   )
//     .then((sqlResponse) => {
//       updateLatestPut(res).then((response) => {
//         console.log(
//           "UpdateLatestPut response in toggleHeavy route: ",
//           response
//         );
//       });
//       console.log("sqlResponse toggleHeavy route: ", sqlResponse);
//       res.status(201).send(sqlResponse);
//     })
//     .catch((sqlErr) => {
//       console.log("There was an error in the toggleHeavy sql call: ", sqlErr);
//       res.status(400).send(sqlErr);
//     });
// });

router.put("/setVolumeRadio", (req, res) => {
  console.log("setVolumeRadio route apiRoutes.js");
  models.Car.update(
    { volume: req.body.newVolume },
    { where: { num: req.body.num } }
  )
    .then((setRadioRouteResponse) => {
      models.Car.findOne({ where: { num: req.body.num } }).then((car) => {
        console.log("The volume was just updated for car: ", car);
        updateLatestPut(res)
          .then((response) => {
            console.log(
              "UpdateLatestPut response in toggleHeavy route: ",
              response
            );
            res.status(200).send(car);
          })
          .catch((err) => {
            console.log("There was an error: ", err);
            res.status(400).send(err);
          });
      });

      console.log("setRadioRouteResponse", setRadioRouteResponse);
      updateLatestPut(res);
    })
    .catch((setRadioSQLError) => {
      console.log("There was a SQL error: ", setRadioSQLError);
      res.status(400).send(setRadioSQLError);
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
      updateLatestPut(res).then((response) => {
        console.log(
          "UpdateLatestPut response in toggleHeavy route: ",
          response
        );
      });
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
  //  First update the key status
  models.Car.update(
    { keyz: req.body.newKeys },
    {
      where: { num: req.body.num },
    }
  )
    .then((sqlResponse) => {
      //  Then find the car that was just updated
      models.Car.findOne({ where: { num: req.body.num } }).then((car) => {
        console.log("The keys were just updated for car: ", car);
        updateLatestPut(res)
          .then((response) => {
            console.log(
              "UpdateLatestPut response in toggleHeavy route: ",
              response
            );
            res.status(200).send(car);
          })
          .catch((err) => {
            console.log("There was an error: ", err);
            res.status(400).send(err);
          });
      });
      // console.log("sqlResponse toggleKeys route: ", sqlResponse);
      // res.status(201).send(sqlResponse);
    })
    .catch((sqlErr) => {
      console.log("There was an error in the toggleKeys sql call: ", sqlErr);
      res.status(400).send(sqlErr);
    });
});

module.exports = router;
