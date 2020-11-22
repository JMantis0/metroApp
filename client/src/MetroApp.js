import React, { Suspense, lazy, useState, useEffect, useRef } from "react";
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
import MetroClock from "./components/MetroClock";
import MetroTitles from "./components/MetroTitles";

import moment from "moment";
import Dexie from "dexie";
const MetroCar = lazy(() => import("./components/MetroCar"));

console.log(Dexie);
var db = new Dexie("MetroDB");
db.version(1).stores({
  car: "number,volume,keys,createdAt,updatedAt",
  latestPut: "latestPut,createdAt,updatedAt",
});
db.open();

function MetroApp() {
  //  Car data object.
  const [state, setState] = useState([]);
  const [volumeFilterState, setVolumeFilterState] = useState(0);
  //  Dev Collapse
  const [checked, setChecked] = useState(false);
  //  Stores the last time the state was updated
  const [lastStateUpdateTime, setLastStateUpdateTime] = useState(0);
  const [carsNeedingUpdate, setCarsNeedingUpdate] = useState([]);
  //  Ref for search input within MetroSearch.  Used by MetroCar to control display value;
  const searchRef = useRef("");
  const [searchState, setSearchState] = useState("");
  const [footerState, setFooterState] = useState({
    allCount: "...",
    heavyCount: "...",
    lightCount: "...",
    uncheckedCount: "...",
    emptyCount: "...",
  });
  const [online, setOnline] = useState(true);

  // Listeners to detect offline and online status
  //  On first render, get Metro Car data from server DB and set it to state.
  useEffect(() => {
    if (navigator.onLine) {
      console.log("Connected to the network.");
    } else {
      console.log("Disconnected from the network.");
    }
    console.log("Getting car data");
    setLastStateUpdateTime(moment().unix());
    requestMetroCarDataAndSetStates();
    requestCountsAndSetFooterState();

    //  Handles dexie records when connection is lost and regained.
    const networkEventHandler = (event) => {
      console.log(
        "Inside online/offline networkEventHandler.  The event is: ",
        event
      );
      console.log("navigator.onLine is: ", navigator.onLine);
      console.log("setting online state...");
      setOnline(navigator.onLine);
      if (event.type === "online") {
        console.log("Alert: Now connected to the network.");
        //  Check for indexedDB records.
        //  If they exist attempt a put request.
        const carCollection = db.car.toCollection();
        const recordsExist = new Promise((resolve, reject) => {
          carCollection.count((count) => {
            console.log(`if ${count} is 0, there are no records`);
            if (count !== 0) {
              console.log(`There are ${count} records in the indexedDB`);
              resolve(true);
            } else if (count === 0) {
              console.log("There are no records in the indexedDB");
              resolve(false);
            } else {
              reject(
                "Error: count was neither !== 0 nor === 0.  count: ",
                count
              );
            }
          });
        });
        recordsExist.then((answer) => {
          if (recordsExist) {
            //  use collection.toArray to get convert records in
            //  the indexedDB to an array.
            carCollection.toArray((dexieCarData) => {
              console.log("Sending records saved while offline to server...");
              //Put request goes here with toArray()
              axios
                .put("/api/transferIndexedDBRecords", {
                  data: dexieCarData,
                })
                .then((response) => {
                  console.log(
                    "Response from /transferIndexedDBRecords: ",
                    response
                  );
                  //  If OKAY response, then delete all records from indexedDB
                  const carCollection = db.car.toCollection();
                  db.transaction("rw", db.car, () => {
                    carCollection.eachPrimaryKey((key) => {
                      console.log("key: ", key);
                      console.log("Deleting dexie record for car ", key);
                      db.car.delete(key);
                    });
                  }).catch((err) => {
                    console.log("There was an error: ", err);
                  });
                })
                .catch((err) => {
                  console.log("There was an error: ", err);
                });
            });
          } else {
            console.log("No dexie records to send.");
          }
        });
        //  recordsExist can now be used as a trigger
        console.log("recordsExist", recordsExist);
      } else {
        console.log("Alert: Now disconnected from the network.");
      }
    };
    window.addEventListener("offline", networkEventHandler);
    window.addEventListener("online", networkEventHandler);
    const cleanUp = () => {
      window.removeEventListener("online", networkEventHandler);
      window.removeEventListener("offline", networkEventHandler);
    };
    return cleanUp;
  }, []);

  useEffect(() => {
    console.log("navigator.onLine: ", navigator.onLine);
  }, [navigator.onLine]);

  useEffect(() => {
    console.log("Setting data-check interval");
    const carTicker = setInterval(async () => {
      checkForNewData();
    }, 5000);
    const cleanup = () => {
      console.log("Clearing data-check interval");
      clearInterval(carTicker);
    };
    return cleanup;
  }, [lastStateUpdateTime]);

  const requestCountsAndSetFooterState = () => {
    console.log("Getting all footer counts...");
    axios
      .get("/api/allFooterCounts")
      .then((response) => {
        console.log("Footer counts from server: ", response);
        // Set up footer object
        const footerStateObject = {
          allCount: response.data[0].all_count,
          heavyCount: response.data[0].heavy_count,
          lightCount: response.data[0].light_count,
          uncheckedCount: response.data[0].unchecked_count,
          emptyCount: response.data[0].empty_count,
        };
        setFooterState(footerStateObject);
      })
      .catch((err) => {
        console.log("There was an error: ", err);
      });
  };

  const requestMetroCarDataAndSetStates = async () => {
    console.log("Client requesting Metro Car data...");
    axios
      .get("/api/getCarNumbers")
      .then((allCarNumbers) => {
        console.log("Response from getCarNumbers route: ", allCarNumbers.data);
        setState(allCarNumbers.data);
      })
      .catch((err) => {
        console.log("There was an error in the getCarNumbers route: ", err);
      });
  };

  const checkForNewData = async () => {
    console.log("Checking for new data...", lastStateUpdateTime);

    axios
      .get(`/api/checkForNewData/${lastStateUpdateTime}`)
      .then((dataCheckResponse) => {
        const newData = dataCheckResponse.data.newData;
        if (newData) {
          console.log("There is new data in the database.");
          //  At this point I want to to trigger the
          //  Labels in the MetroFooter to update
          getOutOfDateCars();
          requestCountsAndSetFooterState();
        } else {
          console.log("Client is already up to date.");
          console.log("There is no new data");
        }
        return newData;
      })
      .catch((dataCheckErr) => {
        console.log("There was an error in the dataCheck route", dataCheckErr);
      });
  };

  const getOutOfDateCars = () => {
    console.log("Requesting list of cars with new data on server...");
    axios
      .get(`/api/getOutOfDateCars/${lastStateUpdateTime}`)
      .then((carsToBeUpdated) => {
        console.log(
          "Found " + carsToBeUpdated.data.length + " cars to be updated: ",
          carsToBeUpdated.data
        );
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
    console.log("Sending POST request to server to initialize Metro Cars...");
    axios
      .post("/api/initializeDB", {})
      .then((response) => {
        console.log(
          `Database has been initialized with ${response.data.numberOfRecords} new records`,
          response
        );
      })
      .catch((err) => {
        console.log("There was an error in the initialize call: ", err);
      });
  };

  const deleteDB = () => {
    console.log("Sending DELETE request to server...");
    axios
      .delete("/api/deleteDB", {})
      .then((response) => {
        console.log("All car records in DB have been deleted.", response);
      })
      .catch((err) => {
        console.log("There was an error in the delete call: ", err);
      });
  };

  //

  // This function is only used for testing

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

  // This function is only used for testing
  const changeOneCar = () => {
    setState({ ...state, "130598": { carVolume: "heavy" } });
  };

  return (
    <div className="App">
      <CssBaseline />
      <div className="title" onClick={handleCollapse}>
        METRO APP
      </div>
      <MetroClock />
      <Collapse in={checked}>
        <div>
          {"Last State Update Time: "}
          {moment.unix(lastStateUpdateTime)._d.toString()}
        </div>
        <Button
          onClick={() => {
            const carCollection = db.car.toCollection();
            db.transaction("rw", db.car, () => {
              carCollection.eachPrimaryKey((key) => {
                console.log("key: ", key);
                console.log("Deleting dexie record for car ", key);
                db.car.delete(key);
              });
            }).catch((err) => {
              console.log("There was an error: ", err);
            });
          }}
        >
          Get Dexie Keys
        </Button>
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
        <Button onClick={requestCountsAndSetFooterState}>
          getCounts for footer
        </Button>

        <Button
          onClick={() => {
            console.log("state", state);
            console.log("last state update time", lastStateUpdateTime);
            console.log("needingUpdate", carsNeedingUpdate);
            console.log(moment.unix(lastStateUpdateTime));
            console.log("searchState", searchState);
            console.log("searchRef", searchRef);
            console.log("volumeFilterState", volumeFilterState);
            console.log("footerState: ", footerState);
          }}
        >
          Console.log(state)
        </Button>
        <Button
          onClick={() => {
            console.log("searchRef: ", searchRef);
          }}
        >
          console.log(searchRef)
        </Button>
        <Button variant="contained" color="primary" onClick={checkForNewData}>
          Check for new data
        </Button>
        <Button onClick={updateDBLatestPut}>update latest put</Button>
        <Button onClick={changeOneCar}>ChangeOneCar</Button>
        <Button onClick={getOutOfDateCars}>Get Out of Date Cars</Button>
        <Button
          onClick={() => {
            const carCollection = db.car.toCollection();
            carCollection.count((count) => console.log(count));
            carCollection.toArray((array) => {
              console.log("array", array);
            });
          }}
        >
          get array of car table.
        </Button>
      </Collapse>

      <Grid container>
        <Suspense fallback={<h1>Loading...</h1>}>
          <MetroTitles />
          <Grid item xs={12}>
            {Object.keys(state).map((key) => {
              return (
                <MetroCar
                  key={state[key].number}
                  number={state[key].number}
                  volume={state[key].volume}
                  keys={state[key].keys}
                  updatedAt={state[key].updatedAt}
                  searchRef={searchRef}
                  carsNeedingUpdate={carsNeedingUpdate}
                  setLastStateUpdateTime={setLastStateUpdateTime}
                  searchState={searchState}
                  state={state}
                  setState={setState}
                  volumeFilterState={volumeFilterState}
                  setVolumeFilterState={setVolumeFilterState}
                  online={online}
                ></MetroCar>
              );
            })}
          </Grid>
        </Suspense>
      </Grid>
      <div className={"bottom-space"}></div>
      <MetroFooter
        searchRef={searchRef}
        setSearchState={setSearchState}
        setVolumeFilterState={setVolumeFilterState}
        footerState={footerState}
      />
    </div>
  );
}

export default MetroApp;
