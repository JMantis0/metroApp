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
  //  Stores all car numbers
  const [state, setState] = useState([]);
  //  used for the secret Dev Collapse
  const [checked, setChecked] = useState(false);
  //  Used for filtering MetroCars
  const [filteredCarState, setFilteredCarState] = useState([]);
  //  used to store the last time the state was update
  //  DEPRECATING SOON
  const [lastStateUpdateTime, setLastStateUpdateTime] = useState(0);

  //  Ref passed into the search components
  const searchRef = useRef("");

  //  Onload, getCarNumbers one time.
  useEffect(() => {
    console.log("Getting car data");
    /**
     * getCarNumbers updates state and lastStateUpdateTime
     */
    getCarNumbers();
  }, []);

  // useEffect(() => {
  //   console.log(
  //     "UseEffect triggered from change to lastStateUpdateTime... setting new interval."
  //   );
  //   const carTicker = setInterval(async () => {
  //     console.log("lastUpdateTime: ", lastStateUpdateTime);
  //     console.log(checkForNewData());
  //     if (await checkForNewData()) {
  //       console.log("There is new Data");
  //     }
  //   }, 10000);
  //   const cleanup = () => {
  //     console.log("Cleaning up and clearing interval");
  //     clearInterval(carTicker);
  //   };
  //   return cleanup;
  // }, [lastStateUpdateTime]);

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

  const getCarNumbers = async () => {
    console.log("Function getCarNumbers triggered");
    axios
      .get("/api/getCarNumbers")
      .then((allCarNumbers) => {
        console.log("Response from getCarNumbers route: ", allCarNumbers.data);
        setState(allCarNumbers.data);
        setFilteredCarState(allCarNumbers.data);
        //get current input
        //set filtered car state to be allCars.data with current filter applied.

        // setFilteredCarState(
        //   allCars.data.filter((car) =>
        //     car.num.includes(searchRef.current.value)
        //   )
        // );
      })
      .catch((err) => {
        console.log("There was an error in the getCarNumbers route: ", err);
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

  const changeOneCar = () => {
    // setState({...state, state[0].volume: "empty"})
    setState(...state, state[Object.keys(state)[0]]: { carVolume: "heavy" });
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
        <Button onClick={getCarNumbers}>Get Car Numbers</Button>

        <Button
          onClick={() => {
            console.log("state", state);
            console.log(state["130598"]);
            console.log("last state update time", lastStateUpdateTime);
          }}
        >
          Console.log(state)
        </Button>
        {/* <Button variant="contained" color="primary" onClick={checkForNewData}>
          Check for new data
        </Button> */}
        <Button onClick={testLatestPut}>update latest put</Button>
        <Button onClick={changeOneCar}>ChangeOneCar</Button>
      </Collapse>

      <Grid container>
        <Suspense fallback={<h1>Loading...</h1>}>
          {/* Perhaps rendering directly from state is not the best way
          and perhaps state should be defined as an object not an array */}
          {Object.keys(filteredCarState).map((key) => {
            return (
              <Grid item xs={12}>
                <MetroCar
                  key={filteredCarState[key].number}
                  updatedAt={filteredCarState[key].updatedAt}
                  setLastStateUpdateTime={setLastStateUpdateTime}
                  number={filteredCarState[key].number}
                  volume={filteredCarState[key].volume}
                  keys={filteredCarState[key].keys}
                  getCarNumbers={getCarNumbers}
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
