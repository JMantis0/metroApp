import React, { memo, useState, useEffect, useMemo } from "react";

//  mui components
import Paper from "@material-ui/core/Paper";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import LocalShippingRoundedIcon from "@material-ui/icons/LocalShippingRounded";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

//  npm libraries
import axios from "axios";
import moment from "moment";
import classnames from "classnames";
import Dexie from "dexie";

//  
var db = new Dexie("MetroDB");
db.version(1).stores({
  car: "number,volume,keys,createdAt,updatedAt",
  latestPut: "latestPut,createdAt,updatedAt",
});
console.log(Dexie);
db.open();

const MetroCar = memo(
  ({
    number,
    volume,
    keys,
    updatedAt,
    carsNeedingUpdate,
    setLastStateUpdateTime,
    searchState,
    volumeFilterState,
    online,
  }) => {
    const [metroCarState, setMetroCarState] = useState({});

    //  I feel like npm classnames is something that was available in jQuery
    //  and haD been missing from React.  In jQuery I tended to use
    //  addClass(); and removeClass(); methods quite a lot.
    //  classnames npm is an even more useful version of these methods.
    //  The classnames npm is going to  be a wonderful library moving forward.

    //  npm classnames.  Here are the conditions where a car should be hidden
    const carClasses = classnames({
      hidden:
        //  User wants to only display heavy cars
        (metroCarState.carVolume !== "heavy" &&
          volumeFilterState === "heavy") ||
        //  User wants to display only light cars
        (metroCarState.carVolume !== "light" &&
          volumeFilterState === "light") ||
        // User wants to display only unchecked cars
        (metroCarState.carVolume !== "unchecked" &&
          volumeFilterState === "unchecked") ||
        // User wants to display only unchecked cars
        (metroCarState.carVolume !== "empty" &&
          volumeFilterState === "empty") ||
        //  user wants to display only cars within search parameters
        !number.includes(searchState),
      fadeOut:
        //  only fade out heavy cars
        (metroCarState.carVolume !== "heavy" &&
          volumeFilterState === "heavy") ||
        //  fade out only light cars
        (metroCarState.carVolume !== "light" &&
          volumeFilterState === "light") ||
        // fade out only unchecked cars
        (metroCarState.carVolume !== "unchecked" &&
          volumeFilterState === "unchecked") ||
        // fade out only unchecked cars
        (metroCarState.carVolume !== "empty" &&
          volumeFilterState === "empty") ||
        //  fade out only cars within search parameters
        !number.includes(searchState),
    });

    // During render, this useMemo
    // sets the metroCarState to props values.
    useMemo(() => {
      setMetroCarState({
        carNumber: number,
        carKeys: keys,
        carVolume: volume,
        carUpdatedAt: updatedAt,
        carInvisible: false,
      });
    }, []);

    //  When carsNeedingUpdate changes, this useEffect
    //  checks to see if this MetroCar needs to update, and
    //  if so, updates.
    useEffect(() => {
      if (carsNeedingUpdate.indexOf(metroCarState.carNumber) > -1) {
        console.log("Cars to update: ", carsNeedingUpdate);
        console.log("Updating car ", metroCarState.carNumber);
        getNewMetroCarData();
      }
    }, [carsNeedingUpdate]);

    //  This will be the setMetroCarState route

    const getNewMetroCarData = () => {
      console.log(`Requesting new data for car ${number}...`);
      axios
        .get(`/api/updateMetroCar/${number}`)
        .then((updateCarResponse) => {
          console.log("Car data obtained", updateCarResponse);
          const newMetroCarState = {
            ...metroCarState,
            carVolume: updateCarResponse.data.volume,
            carKeys: updateCarResponse.data.keyz,
            carUpdatedAt: updateCarResponse.data.updatedAt,
          };
          console.log(`Set state for car ${number}`);
          setMetroCarState(newMetroCarState);
          console.log(
            `Set lastStateUpdateTime to ${moment(
              updateCarResponse.data.updatedAt
            ).unix()}`
          );
          setLastStateUpdateTime(
            moment(updateCarResponse.data.updatedAt).unix()
          );
        })
        .catch((updateCarError) => {
          console.log("Error from updateMetroCar route: ", updateCarError);
        });
    };

    const handleKeysChange = (event) => {
      const newCarKeysValue = !metroCarState.carKeys;
      console.log(`Client changed car ${number} keys to ${newCarKeysValue}`);
      setMetroCarState({
        ...metroCarState,
        carKeys: newCarKeysValue,
      });

      //  if online
      if (online) {
        console.log("Sending PUT request to server with new keys value...");
        axios
          .put("/api/toggleKeys", {
            newKeys: !metroCarState.carKeys,
            num: number,
          })
          .then((response) => {
            console.log("Car data in DB has been updated: ", response.data);
            //  Important to set carUpdatedAt
            setMetroCarState({
              ...metroCarState,
              carKeys: response.data.keyz,
              carUpdatedAt: response.data.updatedAt,
            });
          })
          .catch((err) => {
            console.log("There was an error: ", err);
          });
      }
      //  If offline:
      //  1) Check to see if any indexedDB records exist for this car, then
      //  2) If so, update the indexedDB record for that car
      //  3) If no, add an indexedDB record that that car
      else {
        console.log("No network connection available, using indexedDB...");

        //  a DB transaction handles a group of
        //  db operations with only one catch.  Very useful
        db.transaction("rw", db.car, () => {
          console.log(
            `Checking indexed DB for record with car ${metroCarState.carNumber}...`
          );
          db.car.get(metroCarState.carNumber, (response) => {
            if (response) {
              console.log(
                `Indexed DB record found for car ${metroCarState.carNumber}.`,
                response
              );
              console.log(
                `Updating indexed DB record for ${metroCarState.carNumber}...`
              );
              db.car
                .update(metroCarState.carNumber, {
                  number: metroCarState.carNumber,
                  volume: metroCarState.carVolume,
                  keys: newCarKeysValue,
                  updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
                })
                .then((response) => {
                  console.log(
                    `Successfully updated Indexed DB record for car ${metroCarState.carNumber}`,
                    response
                  );
                })
                .catch((err) => {
                  console.log(
                    `There was an error updating car ${metroCarState.carNumber}`,
                    err
                  );
                });
            } else {
              console.log(
                `No indexed DB record found for car ${metroCarState.carNumber}`
              );
              console.log(
                `Adding indexed DB record for car ${metroCarState.carNumber}...`
              );
              db.car
                .add({
                  number: metroCarState.carNumber,
                  volume: metroCarState.carVolume,
                  keys: newCarKeysValue,
                  createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
                  updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
                })
                .then((response) => {
                  console.log("Car added from dexie: ", response);
                })
                .catch((err) => {
                  console.log("there was a dexie when adding car error: ", err);
                });
            }
          });
        }).catch((err) => {
          console.log("IndexedDB transaction error: ", err);
        });
      }
    };

    const handleVolumeChange = (event) => {
      const newVolume = event.target.value;
      console.log(`Client changed car ${number} volume to ${newVolume}`);
      setMetroCarState({
        ...metroCarState,
        carVolume: newVolume,
      });

      if (online) {
        console.log("Sending PUT request to server with new volume value...");
        axios
          .put("/api/setVolumeRadio", {
            newVolume: newVolume,
            num: number,
          })
          .then((setVolumeResponse) => {
            console.log(
              "Car data in DB has been updated: ",
              setVolumeResponse.data
            );

            const updatedAtUnix = moment(
              setVolumeResponse.data.updatedAt
            ).unix();
            setMetroCarState({
              ...metroCarState,
              carVolume: setVolumeResponse.data.volume,
              carUpdatedAt: setVolumeResponse.data.updatedAt,
            });
          })
          .catch((error) => {
            console.log(
              ("There was an error in the setVolumeRadio route: ", error)
            );
          });
      }
      //  If offline:
      //  1) Check to see if any indexedDB records exist for this car, then
      //  2) If so, update the indexedDB record for that car
      //  3) If no, add an indexedDB record that that car
      else {
        console.log("offline!  indexxedDB transaction occuring...");

        //  a DB transaction handles a group of
        //  db operations with only one catch.  Very useful
        db.transaction("rw", db.car, () => {
          console.log(
            `Checking indexedDB for record with car ${metroCarState.carNumber}...`
          );
          db.car.get(metroCarState.carNumber, (response) => {
            console.log("db.car.where: ", response);
            if (response) {
              console.log(
                `Record found for car ${metroCarState.carNumber} found in indexedDB`,
                response
              );
              console.log(`Updating entry for ${metroCarState.carNumber}...`);
              db.car
                .update(metroCarState.carNumber, {
                  number: metroCarState.carNumber,
                  volume: newVolume,
                  keys: metroCarState.carKeys,
                  updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
                })
                .then((response) => {
                  console.log(
                    `Update to car ${metroCarState.carNumber} complete.  Result: `,
                    response
                  );
                })
                .catch((err) => {
                  console.log(
                    `There was an error updating car ${metroCarState.carNumber}`,
                    err
                  );
                });
            } else {
              console.log(
                `No record for car ${metroCarState.carNumber} found in indexedDB`
              );
              console.log(
                `Adding record for car ${metroCarState.carNumber} to indexeDB...`
              );
              db.car
                .add({
                  number: metroCarState.carNumber,
                  volume: newVolume,
                  keys: metroCarState.carKeys,
                  createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
                  updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
                })
                .then((response) => {
                  console.log("Car added from dexie: ", response);
                })
                .catch((err) => {
                  console.log("there was a dexie when adding car error: ", err);
                });
            }
          });
        }).catch((err) => {
          console.log("IndexedDB transaction error: ", err);
        });
      }
    };

    //  A MetroCar is a row on the screen with car data and can be interacted with by a user.
    return (
      <div className={carClasses}>
        <Paper>
          <FormGroup row>
            <Grid container alignItems="center" justify="space-evenly">
              <Grid item xs={"auto"}>
                <FormLabel>
                  <LocalShippingRoundedIcon className="shipcon" />
                </FormLabel>
              </Grid>
              <Grid className="car-number" item xs={"auto"}>
                {number}
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  control={
                    <RadioGroup
                      row
                      value={metroCarState.carVolume}
                      onChange={handleVolumeChange}
                      justify="space-around"
                    >
                      <Radio
                        className="heavy-radio"
                        size="small"
                        value="heavy"
                      />
                      <Radio
                        className="light-radio"
                        size="small"
                        value="light"
                      />
                      <Radio
                        className="empty-radio"
                        size="small"
                        value="empty"
                      />
                    </RadioGroup>
                  }
                />
              </Grid>
              <Grid item xs={1}>
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={metroCarState.carKeys}
                      onChange={handleKeysChange}
                      name="keys"
                    />
                  }
                />
              </Grid>
              <Grid item xs={"auto"}>
                {moment(metroCarState.carUpdatedAt).format("hh:mm:ss a")}
              </Grid>
            </Grid>
          </FormGroup>
        </Paper>
      </div>
    );
  }
);
export default MetroCar;
