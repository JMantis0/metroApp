import React, { Component } from "react";
import logo from "./logo.svg";
import "./MetroApp.css";
import axios from "axios";
import { useState, useEffect } from "react";
//     Component imports
import MetroCar from "./components/MetroCar";
//     Mui imports
import Button from "@material-ui/core/Button";
import Collapse from "@material-ui/core/Collapse";
import CssBaseline from "@material-ui/core/CssBaseline";
import moment from "moment";

function MetroApp() {
  const [state, setState] = useState([]);
  const [lastRenderTime, setLastRenderTime] = useState(
    Math.floor(Date.now() / 1000)
  );

  useEffect(() => {
    console.log("useEffect Triggered");
    // const carTicker = setInterval(() => {
    //   checkForNewData();
    //   console.log("Date.now(): ", Date.now());
    // }, 2000);
    setLastRenderTime(Math.floor(Date.now() / 1000));
    axios
      .get("/api/getAllCars")
      .then((allCars) => {
        console.log("Response from get all cars route: ", allCars.data);
        setState(allCars.data);
        console.log(typeof allCars.data);
        return new Promise((resolve, reject) => {
          resolve("Resolve");
        });
      })
      .catch((err) => {
        console.log("There was an error in the getAllCars route: ", err);
      })
      .then((word) => {
        console.log(state);
      });
    // const cleanup = () => {
    //   console.log("Cleaning up and clearing interval");
    //   clearInterval(carTicker);
    // };
    // return cleanup;
  }, []);

  const testBackend = () => {
    axios
      .get("/api/test")
      .then((response) => {
        console.log("Response from test route", response);
      })
      .catch((err) => {
        console.log("There was an error: ", err);
      });
  };

  const checkForNewData = () => {
    const currentUTC = Math.floor(Date.now() / 1000);
    // .toString();
    console.log("currentUTC inside checkForNewData route: ", currentUTC);
    console.log("typeof currentUTC: ", typeof currentUTC);
    axios
      .get(`/api/checkForNewData/${currentUTC}`)
      .then((dataCheckResponse) => {
        console.log("Response from Datacheck route: ", dataCheckResponse);
      })
      .catch((dataCheckErr) => {
        console.log("There was an error in the dataCheck route", dataCheckErr);
      });
  };

  const initializeDB = () => {
    axios
      .post("/api/initializeDB", {})
      .then((response) => {
        console.log("Response from initialize call", response);
        return new Promise((resolve, reject) => {
          resolve(response);
        });
      })
      .catch((err) => {
        console.log("There was an error in the initialize call: ", err);
        return new Promise((resolve, reject) => {
          resolve(err);
        });
      })
      .then((response) => {
        console.log(response, "does this make sense?");
      });
  };

  const getAllCars = () => {
    axios
      .get("/api/getAllCars")
      .then((allCars) => {
        console.log("Response from get all cars route: ", allCars.data);
        setState(allCars.data);
        console.log(typeof allCars.data);
        return new Promise((resolve, reject) => {
          resolve("Resolve");
        });
      })
      .catch((err) => {
        console.log("There was an error in the getAllCars route: ", err);
      })
      .then((word) => {
        console.log(state);
      });
  };

  const deleteDB = () => {
    axios
      .delete("/api/deleteDB", {})
      .then((response) => {
        console.log("response from delete call: ", response);
      })
      .catch((err) => {
        console.log("There was an error in the delete call: ", err);
      });
  };

  const testLatestPut = () => {
    console.log("Initiating latest put Get")
    axios
      .put("api/testLatestPut")
      .then((response) => {
        console.log("Response from latestPut route: ", response);
      })
      .catch((err) => {
        console.log("Error in the testLatestPut route: ", err);
      });
  };

  return (
    <div className="App">
      <CssBaseline />
      METRO APP
      <Button onClick={testBackend}>Test Backend (check console)</Button>
      <Button variant="outlined" onClick={initializeDB}>
        Initialize DB
      </Button>
      <Button variant="outlined" color="secondary" onClick={deleteDB}>
        Delete DB
      </Button>
      <Button onClick={getAllCars}>Get All Cars</Button>
      <Collapse></Collapse>
      <Button
        onClick={() => {
          console.log(state);
          console.log(lastRenderTime);
        }}
      >
        Console.log(state)
      </Button>
      <Button variant="filled" color="primary" onClick={checkForNewData}>
        Check for new data
      </Button>
      <Button onClick={testLatestPut}>update latest put</Button>
      {state.map((metroCar) => {
        console.log(metroCar.id);
        return (
          <div>
            <MetroCar
              key={metroCar.num}
              getAllCars={getAllCars}
              number={metroCar.num}
              key={metroCar.id}
              flashers={metroCar.flashers}
              heavy={metroCar.heavy}
              clear={metroCar.clear}
              keys={metroCar.keyz}
            ></MetroCar>{" "}
          </div>
        );
      })}
    </div>
  );
}

export default MetroApp;
