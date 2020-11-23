import React, { Suspense, lazy, useState, useEffect, useRef } from "react";
import "./MetroApp.css";
//  Mui imports
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Collapse from "@material-ui/core/Collapse";
import CssBaseline from "@material-ui/core/CssBaseline";
//  Component imports
import MetroFooter from "./components/MetroFooter";
import MetroClock from "./components/MetroClock";
import MetroTitles from "./components/MetroTitles";
//  npm library imports
import axios from "axios";
import moment from "moment";
import Dexie from "dexie";
//  lazy load for MetroCars
const MetroCar = lazy(() => import("./components/MetroCar"));
//  Set up indexedDB using dexie API
var db = new Dexie("MetroDB");
db.version(1).stores({
  car: "number,volume,keys,createdAt,updatedAt",
  latestPut: "latestPut,createdAt,updatedAt",
});
db.open();
//  Functional component definition
function MetroApp() {
  //  Car data object.  Is only set on first render.
  const [state, setState] = useState([]);
  //  Used by metroFooter to display cars by volume type.
  const [volumeFilterState, setVolumeFilterState] = useState(0);
  //  Dev Collapse
  const [checked, setChecked] = useState(false);
  //  Used to check server DB for new records.
  const [lastStateUpdateTime, setLastStateUpdateTime] = useState(0);
  //  Used to tell MetroCars to update.
  const [carsNeedingUpdate, setCarsNeedingUpdate] = useState([]);
  //  Ref and state for search input within MetroSearch.
  //  Used by MetroCar to display cars with number filter.
  const searchRef = useRef("");
  const [searchState, setSearchState] = useState("");
  //  Used to display counts grouped by volume type in MetroFooter.
  const [footerState, setFooterState] = useState({
    allCount: "...",
    heavyCount: "...",
    lightCount: "...",
    uncheckedCount: "...",
    emptyCount: "...",
  });
  //  Used to control how records are saved
  const [online, setOnline] = useState(true);
  //  The useEffect with dependency [] only triggers on first render.
  //  Fires off functions to get car data from server DB and then
  //  sets up event listeners for when the clients network status
  //  changes from online to offline and vice versa.
  useEffect(() => {
    const indexedDBNetworkEventHandler = (event) => {
      setOnline(navigator.onLine);
      if (event.type === "online") {
        console.log("Connected to the network.");
        sendAnyIndexedDBRecordsToServer();
      } else {
        console.log("Disconnected from the network.");
      }
    };
    setLastStateUpdateTime(moment().unix());
    requestMetroCarDataAndSetStates();
    requestCountsAndSetFooterState();
    sendAnyIndexedDBRecordsToServer();
    window.addEventListener("offline", indexedDBNetworkEventHandler);
    window.addEventListener("online", indexedDBNetworkEventHandler);
    const cleanUp = () => {
      window.removeEventListener("offline", indexedDBNetworkEventHandler);
      window.removeEventListener("online", indexedDBNetworkEventHandler);
    };
    return cleanUp;
  }, []);

  useEffect(() => {
    const dataCheckIntervalNetworkEventHandler = (event) => {
      console.log("offline/online event detected. event.type: ", event.type);
      if (event.type === "offline") {
        console.log("Disconnected from network.  Stop data checks.");
        clearInterval(carTicker);
      } else if (event.type === "online") {
        console.log("Connected to network.  Checking for data...");
        carTicker = setInterval(async () => {
          checkForNewData();
        }, 5000);
      }
    };
    let carTicker = setInterval(async () => {
      checkForNewData();
    }, 5000);
    window.addEventListener("offline", dataCheckIntervalNetworkEventHandler);
    window.addEventListener("online", dataCheckIntervalNetworkEventHandler);
    const cleanup = () => {
      clearInterval(carTicker);
      window.removeEventListener(
        "offline",
        dataCheckIntervalNetworkEventHandler
      );
      window.removeEventListener(
        "online",
        dataCheckIntervalNetworkEventHandler
      );
    };
    return cleanup;
  }, [lastStateUpdateTime]);

  const sendAnyIndexedDBRecordsToServer = () => {
    //  Dexie methods convert car object-store into a collection and
    //  use it to get count of all records in the car object store.
    const carCollection = db.car.toCollection();
    //  Set up a promise that returns true if there are records in the collection
    //  and returns false if there are no records in the collection.
    const doRecordsExist = new Promise((resolve, reject) => {
      carCollection.count((count) => {
        if (count !== 0) {
          console.log(`There are ${count} records in the indexedDB`);
          resolve(true);
        } else if (count === 0) {
          console.log("There are no records in the indexedDB");
          resolve(false);
        } else {
          reject({
            errorMsg: "Error: count was neither !== 0 nor === 0.  count: ",
            error: count,
          });
        }
      });
    });
    //  Execute the promise and use the result to decide whether
    //  to make a PUT request or do nothing.
    doRecordsExist.then((atLeastOneRecord) => {
      if (typeof atLeastOneRecord !== "boolean") {
        console.log(atLeastOneRecord.errorMsg, atLeastOneRecord.error);
      } else if (atLeastOneRecord) {
        //  collection.toArray converts indexedDB records to an array.
        carCollection.toArray((indexedDBCarData) => {
          console.log("Sending indexedDB car data to server...");
          axios
            .put("/api/transferIndexedDBRecords", {
              data: indexedDBCarData,
            })
            .then((response) => {
              console.log(
                "Success! Server DB updated for these cars: ",
                response
              );
              //  If OKAY response, then delete all records from indexedDB
              const carCollection = db.car.toCollection();
              db.transaction("rw", db.car, () => {
                carCollection.eachPrimaryKey((key) => {
                  console.log("Deleting old indexedDB record for car... ", key);
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
        console.log("No indexedDB records to send.");
      }
    });
  };

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

  return (
    <div className="App">
      <CssBaseline />
      <div className="title" onClick={handleCollapse}>
      <span className="big-letter">M</span>ETRO <span className="big-letter">A</span>PP
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
            <TitleCar></TitleCar>
            {Object.keys(state).map((key, index) => {
              return (
                <MetroCar
                  key={index + 1}
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
            End of list
          </Grid>
        </Suspense>
      </Grid>
      <div className={"bottom-space"}></div>
      <MetroFooter
        searchRef={searchRef}
        searchState={searchState}
        setSearchState={setSearchState}
        setVolumeFilterState={setVolumeFilterState}
        footerState={footerState}
      />
    </div>
  );
}

export default MetroApp;
