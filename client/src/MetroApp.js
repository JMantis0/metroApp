import React, { Suspense, lazy } from "react";
import "./MetroApp.css";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
//     Component imports
// import MetroCar from "./components/MetroCar";
import MetroSearch from "./components/MetroSearch";
//     Mui imports
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Collapse from "@material-ui/core/Collapse";
import CssBaseline from "@material-ui/core/CssBaseline";

// component imports
import MetroFooter from "./components/MetroFooter";

import moment from "moment";
const MetroCar = lazy(() => import("./components/MetroCar"));

function MetroApp() {
  const [state, setState] = useState([]);
  const [checked, setChecked] = useState(false);
  const [filteredCarState, setFilteredCarState] = useState([]);
  const [lastStateUpdateTime, setLastStateUpdateTime] = useState(0);
  const searchRef = useRef("");

  //  Onload, getAllCars one time.
  useEffect(() => {
    console.log("Getting car data");
    /**
     * getAllCars updates state and lastStateUpdateTime
     */
    getAllCars();
  }, []);

  useEffect(() => {
    console.log("inside useEffect2");
    const carTicker = setInterval(async () => {
      // console.log("lastUpdateTime: ", lastStateUpdateTime);
      // console.log(checkForNewData());
      if (await checkForNewData()) {
        console.log("There is new Data");
        getAllCars();
      }
    }, 5000);
    const cleanup = () => {
      console.log("Cleaning up and clearing interval");
      clearInterval(carTicker);
    };
    return cleanup;
  }, [lastStateUpdateTime]);

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

  const handleCollapse = () => {
    console.log("inside handleCollapse");
    console.log(checked);
    setChecked(!checked);
  };

  const checkForNewData = () => {
    console.log("Checking for new data");
    return new Promise((resolve, reject) => {
      axios
        .get(`/api/checkForNewData/${lastStateUpdateTime}`)
        .then((dataCheckResponse) => {
          console.log("Response from Datacheck route: ", dataCheckResponse);
          const newData = dataCheckResponse.data.newData;
          // console.log("newData is:", newData);
          resolve(newData);
        })
        .catch((dataCheckErr) => {
          console.log(
            "There was an error in the dataCheck route",
            dataCheckErr
          );
          reject(dataCheckErr);
        });
    }).catch((promiseError) => {
      console.log(
        "there was an error in the checkForNewData promise",
        promiseError
      );
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

  const getAllCars = async () => {
    axios
      .get("/api/getAllCars")
      .then((allCars) => {
        console.log("Response from get all cars route: ", allCars.data);
        setState(allCars.data);
        //get current input
        //set filtered car state to be allCars.data with current filter applied.
        setFilteredCarState(
          allCars.data.filter((car) =>
            car.num.includes(searchRef.current.value)
          )
        );
        setLastStateUpdateTime(Math.floor(Date.now() / 1000));
      })
      .catch((err) => {
        console.log("There was an error in the getAllCars route: ", err);
      });
  };

  const deleteDB = () => {
    console.log("deleteDB triggered");
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

  // const getFilteredCars = (childData) => {
  //   console.log("childData", childData);
  //   console.log("insideGetFilteredCars  ");
  //   if (childData) {
  //     console.log("inside if(childData)");
  //     return childData;
  //   }
  //   console.log("childData is false");
  //   return state;
  // };

  return (
    <div className="App">
      <CssBaseline />
      <div onClick={handleCollapse}>METRO APP</div>
      {/* <Input
        inputRef={inputRef}
        onChange={() => console.log("inputString", inputRef.current.value)}
      ></Input> */}
      <MetroSearch
        searchRef={searchRef}
        filteredCarState={filteredCarState}
        setFilteredCarState={setFilteredCarState}
        state={state}
      />
      <Collapse in={checked}>
        <button
          onClick={() => {
            console.log("filteredCarState: ", filteredCarState);
          }}
        >
          Filtered Car State
        </button>
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
        <Button variant="contained" color="primary" onClick={checkForNewData}>
          Check for new data
        </Button>
        <Button onClick={testLatestPut}>update latest put</Button>
      </Collapse>

      <Grid container>
        <Suspense fallback={<h1>Loading...</h1>}>
          {filteredCarState.map((metroCar) => {
            return (
              <Grid item xs={4}>
                <MetroCar
                  state={state}
                  key={metroCar.num}
                  getAllCars={getAllCars}
                  number={metroCar.num}
                  key={metroCar.id}
                  flashers={metroCar.flashers}
                  heavy={metroCar.heavy}
                  clear={metroCar.clear}
                  keys={metroCar.keyz}
                  volume={metroCar.volume}
                ></MetroCar>
              </Grid>
            );
          })}
        </Suspense>
      </Grid>
      <MetroFooter />
    </div>
  );
}

export default MetroApp;
