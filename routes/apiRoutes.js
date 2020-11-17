const router = require("express").Router();
const models = require("../models");
const env = require("dotenv");
const axios = require("axios");
const Sequelize = require("sequelize");
const moment = require("moment");
moment().format();

const XLSX = require("xlsx");
const metroBook = XLSX.readFile("./Master Car List.xlsx");
const sheet_name_list = metroBook.SheetNames;
const metroCarObject = XLSX.utils.sheet_to_json(
  metroBook.Sheets[sheet_name_list[0]]
);
console.log("Current Metro Car numbers :");
console.table(metroCarObject);
console.log(
  `███████████████████████████████████████████████████████████████████`
);
console.log(
  "********** HELLO  ***********\n**** YOU ARE DEVELOPING ******\n**** METRO APP, JESSE!! ******"
);
console.log(
  `███████████████████████████████████████████████████████████████████`
);

const updateLatestPut = (res) => {
  console.log(
    `███████████████████████████████████████████████████████████████████`
  );
  console.log(
    `███████████████████████████████████████████████████████████████████`
  );
  console.log(`THIS IS NOT A REQUEST FROM THE CLIENT`);
  console.log(`Updating latest put record`);
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
  console.log(
    `███████████████████████████████████████████████████████████████████`
  );
  console.log(
    `███████████████████████████████████████████████████████████████████`
  );
  console.log(
    `GET request from client: /api/updateMetroCar/${req.params.carNumber}`
  );
  console.log(`Getting db record for car ${req.params.carNumber}...`);
  models.Car.findOne({ where: { num: req.params.carNumber } })
    .then((car) => {
      console.log("Car found: ", car.dataValues.num);
      console.log("Sending car record to client");
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

router.get("/test", (req, res) => {
  console.log(
    `███████████████████████████████████████████████████████████████████`
  );
  console.log(
    `███████████████████████████████████████████████████████████████████`
  );
  console.log(`GET request from client: /api/test`);
  console.log("Sending OK status to client.");
  res.send(200);
});

router.post("/initializeDB", (req, res) => {
  console.log(
    `███████████████████████████████████████████████████████████████████`
  );
  console.log(
    `███████████████████████████████████████████████████████████████████`
  );
  console.log(`POST request from client: /api/initializeDB`);
  console.log("Initializing the db...");
  models.Car.bulkCreate(metroCarObject)
    .then((response) => {
      console.log("Database initialized.  Sending response to client.");
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("There was an error in the initialize route: ", { err });
      res.status(400).send({ err });
    });
});

router.delete("/deleteDB", (req, res) => {
  console.log(
    `███████████████████████████████████████████████████████████████████`
  );
  console.log(
    `███████████████████████████████████████████████████████████████████`
  );
  console.log(`DELETE request from client: /api/deleteDB`);
  console.log("Removing all records in Car table...");
  models.Car.destroy({
    where: {},
    truncate: true,
  })
    .then((response) => {
      console.log(
        "All Car records destroyed.  Sending Sequelize response to client."
      );
      res.sendStatus(202);
    })
    .catch((err) => {
      console.log("There was an error in the delete route: ", err);
      res.status(400).send(err);
    });
});

router.get("/getCarNumbers", (req, res) => {
  console.log(
    `███████████████████████████████████████████████████████████████████`
  );
  console.log(
    `███████████████████████████████████████████████████████████████████`
  );
  console.log(`GET request from client: /api/getCarNumbers`);
  console.log("Getting car data ...");
  models.Car.findAll({})
    //finds the whole set
    .then((allCars) => {
      const carObject = {};
      allCars.forEach((car) => {
        carObject[car.dataValues.num] = {
          number: car.dataValues.num,
          volume: car.dataValues.volume,
          keys: car.dataValues.keyz,
          updatedAt: car.dataValues.updatedAt,
        };
      });
      console.log("Car data obtained.  Sending data to client.");
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
  console.log(
    `███████████████████████████████████████████████████████████████████`
  );
  console.log(
    `███████████████████████████████████████████████████████████████████`
  );
  console.log(
    `GET request from client: /api/checkForNewData/${req.params.lastStateUpdateTime}}`
  );
  const frontEndMoment = moment.unix(req.params.lastStateUpdateTime);
  console.log(
    "Comparing latest update time from client against most recent update time in db"
  );
  //  I want to compare this timestamp to the most recent updatedAt
  models.LatestPut.findAll({ where: { id: 1 } })
    .then((response) => {
      const updatedAtMoment = moment(response[0].dataValues.updatedAt);
      console.log(`Last time client updated: ${frontEndMoment}`);
      console.log(`Most recent update in DB: ${updatedAtMoment}`);
      if (frontEndMoment.diff(updatedAtMoment, "seconds") < 0) {
        console.log(`There is new data.`);
        console.log("Sending value true to client");
        res.status(200).send({ newData: true });
      } else {
        console.log("There is no new data.");
        console.log("Sending value false to client");
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
  console.log(
    `███████████████████████████████████████████████████████████████████`
  );
  console.log(
    `███████████████████████████████████████████████████████████████████`
  );
  console.log(
    `GET request from client: /api/getOutOfDateCars/${req.params.lastStateUpdateTime}`
  );
  console.log(`Checking database for updatedAt values...`);
  const lastStateUpdateTime = req.params.lastStateUpdateTime;
  models.Car.findAll({})
    .then((allCars) => {
      const carsToBeUpdated = [];
      allCars.forEach((car) => {
        const carUpdatedAtInUnix = moment(car.dataValues.updatedAt).unix();
        if (lastStateUpdateTime < carUpdatedAtInUnix) {
          carsToBeUpdated.push(car.dataValues.num);
        }
      });
      console.log(
        "Found cars updated after the last client update: ",
        carsToBeUpdated
      );
      console.log("Sending car numbers to client.");
      res.status(200).send(carsToBeUpdated);
    })
    .catch((error) => {
      console.log("There was an error: ", error);
      res.status(400).send(error);
    });
});

router.put("/setVolumeRadio", (req, res) => {
  console.log(
    `███████████████████████████████████████████████████████████████████`
  );
  console.log(
    `███████████████████████████████████████████████████████████████████`
  );
  console.log(
    `PUT request from client: /api/setVolumeRadio with object body: ${JSON.stringify(
      req.body
    )}`
  );
  console.log(`Updating database for car ${req.body.num}`);
  models.Car.update(
    { volume: req.body.newVolume },
    { where: { num: req.body.num } }
  )
    .then((setRadioRouteResponse) => {
      models.Car.findOne({ where: { num: req.body.num } }).then((car) => {
        console.log(
          `Volume column for car ${req.body.num} updated to ${req.body.newVolume}`
        );
        console.log("Updating Latest PUT time...");
        updateLatestPut(res)
          .then((response) => {
            console.log("Latest PUT time updated.");

            res.status(200).send(car);
          })
          .catch((err) => {
            console.log("There was an error: ", err);
            res.status(400).send(err);
          });
      });
    })
    .catch((setRadioSQLError) => {
      console.log("Error setRadioSQLErrpor: ", setRadioSQLError);
      res.status(400).send(setRadioSQLError);
    });
});

router.put("/toggleKeys", (req, res) => {
  console.log(
    `███████████████████████████████████████████████████████████████████`
  );
  console.log(
    `███████████████████████████████████████████████████████████████████`
  );
  console.log(
    `PUT request from client: /api/toggleKeys with object body: ${JSON.stringify(
      req.body
    )}`
  );
  console.log(`updating database for car ${req.body.num}`);
  models.Car.update(
    { keyz: req.body.newKeys },
    {
      where: { num: req.body.num },
    }
  )
    .then((sqlResponse) => {
      //  Then find the car that was just updated
      models.Car.findOne({ where: { num: req.body.num } }).then((car) => {
        console.log(
          `Database record for car ${car.dataValues.num} has been updated`
        );
        console.log(
          `The 'keyz' column has been updated to value ${car.dataValues.keyz}`
        );
        updateLatestPut(res)
          .then((response) => {
            console.log(
              "UpdateLatestPut response in toggleKeys route: ",
              response
            );
            res.status(200).send(car);
          })
          .catch((err) => {
            console.log("There was an error: ", err);
            res.status(400).send(err);
          });
      });
    })
    .catch((sqlErr) => {
      console.log("There was an error in the toggleKeys sql call: ", sqlErr);
      res.status(400).send(sqlErr);
    });
});

module.exports = router;
