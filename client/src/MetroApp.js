import React, { Component } from "react";
import logo from "./logo.svg";
import "./MetroApp.css";
import axios from "axios";
import { useState, useEffect } from "react";
//     Component imports
import MetroCar from "./components/MetroCar";
//     Mui imports
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Collapse from "@material-ui/core/Collapse";
import CssBaseline from "@material-ui/core/CssBaseline";
import moment from "moment";

function MetroApp() {
  const [state, setState] = useState([]);
  const [lastStateUpdateTime, setLastStateUpdateTime] = useState(0);

  useEffect(() => {
    console.log("Getting car data");
    /**
     * getAllCars updates state and lastStateUpdateTime
     */
    getAllCars();
  }, []);

  useEffect(() => {
    const carTicker = setInterval(async () => {
      console.log("lastUpdateTime: ", lastStateUpdateTime);
      console.log(checkForNewData());
      if (await checkForNewData()) {
        console.log("inside true");
        getAllCars();
      }
    }, 5000);
    console.log("inside useEffect2");
    const cleanup = () => {
      console.log("Cleaning up and clearing interval");
      clearInterval(carTicker);
    };
    return cleanup;
  });

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
    return new Promise((resolve, reject) => {
      axios
        .get(`/api/checkForNewData/${lastStateUpdateTime}`)
        .then((dataCheckResponse) => {
          console.log("Response from Datacheck route: ", dataCheckResponse);
          const newData = dataCheckResponse.data.newData;
          console.log("newData is:", newData);
          resolve(newData);
        })
        .catch((dataCheckErr) => {
          console.log(
            "There was an error in the dataCheck route",
            dataCheckErr
          );
          reject(dataCheckErr);
        });
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
        // console.log("Response from get all cars route: ", allCars.data);
        setState(allCars.data);
        setLastStateUpdateTime(Math.floor(Date.now() / 1000));
      })
      .catch((err) => {
        console.log("There was an error in the getAllCars route: ", err);
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
    console.log("Initiating latest put Get");
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
      <div>
        {"Last State Update Time: "}
        {moment.unix(lastStateUpdateTime)._d.toString()}
      </div>
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
          console.log("state", state);
          console.log(
            "last state update time",
            moment.unix(lastStateUpdateTime)._d
          );
        }}
      >
        Console.log(state)
      </Button>
      <Button variant="filled" color="primary" onClick={checkForNewData}>
        Check for new data
      </Button>
      <Button onClick={testLatestPut}>update latest put</Button>
      {state.map((metroCar) => {
        return (
          <Grid container>
            <Grid item xs={6}>
              {metroCar.heavy ? (
                <MetroCar
                  key={metroCar.num}
                  getAllCars={getAllCars}
                  number={metroCar.num}
                  key={metroCar.id}
                  flashers={metroCar.flashers}
                  heavy={metroCar.heavy}
                  clear={metroCar.clear}
                  keys={metroCar.keyz}
                ></MetroCar>
              ) : null}
            </Grid>
            <Grid item xs={6}>
              {!metroCar.heavy ? (
                <MetroCar
                  key={metroCar.num}
                  getAllCars={getAllCars}
                  number={metroCar.num}
                  key={metroCar.id}
                  flashers={metroCar.flashers}
                  heavy={metroCar.heavy}
                  clear={metroCar.clear}
                  keys={metroCar.keyz}
                ></MetroCar>
              ) : null}
            </Grid>
          </Grid>
        );
      })}
    </div>
  );
}

export default MetroApp;
