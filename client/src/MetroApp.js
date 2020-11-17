import React, {
  Suspense,
  lazy,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import "./MetroApp.css";
import axios from "axios";
//     Component imports
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
  //  Car data object.
  const [state, setState] = useState([]);
  //  Dev Collapse
  const [checked, setChecked] = useState(true);
  //  Used for filtering MetroCars
  const [filteredCarState, setFilteredCarState] = useState([]);
  //  used to store the last time the state was update
  //  DEPRECATING SOON
  const [lastStateUpdateTime, setLastStateUpdateTime] = useState(0);
  const [carsNeedingUpdate, setCarsNeedingUpdate] = useState([]);
  //  Ref passed into the search components
  const searchRef = useRef("");
  const [searchState, setSearchState] = useState("");

  //  Onload, getCarNumbers one time.
  useEffect(() => {
    console.log("Getting car data");
    setLastStateUpdateTime(moment().unix());
    requestMetroCarDataAndSetStates();
  }, []);

  const requestMetroCarDataAndSetStates = async () => {
    console.log("Client requesting Metro Car data...");
    axios
      .get("/api/getCarNumbers")
      .then((allCarNumbers) => {
        console.log("Response from getCarNumbers route: ", allCarNumbers.data);
        setState(allCarNumbers.data);
        setFilteredCarState(allCarNumbers.data);
      })
      .catch((err) => {
        console.log("There was an error in the getCarNumbers route: ", err);
      });
  };

  useEffect(() => {
    console.log(
      "UseEffect triggered from change to lastStateUpdateTime... setting new interval."
    );
    const carTicker = setInterval(async () => {
      const thereIsNewData = await checkForNewData();
      console.log("thereIsNewData", thereIsNewData);
      if (thereIsNewData) {
        console.log("There is new Data");
      }
    }, 5000);
    const cleanup = () => {
      console.log("Cleaning up and clearing interval");
      clearInterval(carTicker);
    };
    return cleanup;
  }, [lastStateUpdateTime]);

  //What can change lastStateUpdateTime?

  const checkForNewData = async () => {
    console.log("Checking for new data", lastStateUpdateTime);

    axios
      .get(`/api/checkForNewData/${lastStateUpdateTime}`)
      .then((dataCheckResponse) => {
        console.log("dataCheckResponse ", dataCheckResponse);
        const newData = dataCheckResponse.data.newData;
        console.log("newData is:", newData);
        if (newData) {
          console.log(
            `Now get the data only for the cars that have new data, updated after ${lastStateUpdateTime}`
          );
          getOutOfDateCars();
        }
        return newData;
      })
      .catch((dataCheckErr) => {
        console.log("There was an error in the dataCheck route", dataCheckErr);
      });
  };

  const getOutOfDateCars = () => {
    axios
      .get(`/api/getOutOfDateCars/${lastStateUpdateTime}`)
      .then((carsToBeUpdated) => {
        console.log("Array of cars to be updated: ", carsToBeUpdated.data);
        console.log(carsToBeUpdated.data.length);
        if (carsToBeUpdated.data.length !== 0) {
          //  Changing this state automatically causes each MetroCar to run getNewMetroCarData
          setCarsNeedingUpdate(carsToBeUpdated.data);
        }
      })
      .catch((error) => {
        console.log("There was an error: ", error);
      });
  };

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
    console.log("current state", checked, "new state", !checked);
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

  const updateDBLatestPut = () => {
    console.log("Initiating latest put Get");
    axios
      .put("api/testLatestPut")
      .then((response) => {
        console.log("Response from latestPut route: ", response);
        console.log("response.status is: ", response.status);
        if (response.status === 202) {
          console.log(
            "This is where you would do a get to update the state to match the DB"
          );
        }
      })
      .catch((err) => {
        console.log("Error in the testLatestPut route: ", err);
      });
  };

  const changeOneCar = () => {
    // setState({...state, state[0].volume: "empty"})
    setState({ ...state, "130598": { carVolume: "heavy" } });
  };

  return (
    <div className="App">
      <CssBaseline />
      <div onClick={handleCollapse}>METRO APP</div>
      <MetroSearch
        searchRef={searchRef}
        filteredCarState={filteredCarState}
        setFilteredCarState={setFilteredCarState}
        state={state}
        searchState={searchState}
        setSearchState={setSearchState}
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
        <Button onClick={requestMetroCarDataAndSetStates}>
          Get Car Numbers
        </Button>

        <Button
          onClick={() => {
            console.log("state", state);
            // console.log(state["130598"]);
            console.log("last state update time", lastStateUpdateTime);
            console.log("needingUpdate", carsNeedingUpdate);
            console.log(moment.unix(lastStateUpdateTime));
            console.log("searchState", searchState);
            console.log("searchRef", searchRef);
          }}
        >
          Console.log(state)
        </Button>
        <Button variant="contained" color="primary" onClick={checkForNewData}>
          Check for new data
        </Button>
        <Button onClick={updateDBLatestPut}>update latest put</Button>
        <Button onClick={changeOneCar}>ChangeOneCar</Button>
        <Button onClick={getOutOfDateCars}>Get Out of Date Cars</Button>
      </Collapse>

      <Grid container>
        <Suspense fallback={<h1>Loading...</h1>}>
          {Object.keys(filteredCarState).map((key) => {
            return (
              <Grid item xs={12}>
                <MetroCar
                  key={filteredCarState[key].number}
                  number={filteredCarState[key].number}
                  volume={filteredCarState[key].volume}
                  keys={filteredCarState[key].keys}
                  updatedAt={filteredCarState[key].updatedAt}
                  state={state}
                  searchRef={searchRef}
                  carsNeedingUpdate={carsNeedingUpdate}
                  checkForNewData={checkForNewData}
                  setLastStateUpdateTime={setLastStateUpdateTime}
                  lastStateUpdateTime={lastStateUpdateTime}
                  searchState={searchState}
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
