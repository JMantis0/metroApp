import React, { memo, useState, useEffect, useMemo } from "react";

//  mui components
import Paper from "@material-ui/core/Paper";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import LocalShippingRoundedIcon from "@material-ui/icons/LocalShippingRounded";
import LocalShippingTwoToneIcon from "@material-ui/icons/LocalShippingTwoTone";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

//  npm libraries
import axios from "axios";
import moment from "moment";
import classnames from "classnames";
import Dexie from "dexie";

var db = new Dexie("MetroDB");
db.version(1).stores({
  car: "number,volume,keys,createdAt,updatedAt",
  latestPut: "latestPut,createdAt,updatedAt",
});
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
    //  npm classnames.  Here are the conditions where a car should be hidden

    // During render, this useMemo
    // sets the metroCarState to props values.
    useMemo(() => {
      setMetroCarState({
        carNumber: number,
        carKeys: keys,
        carVolume: volume,
        carUpdatedAt: updatedAt,
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

    const getNewMetroCarData = () => {
      console.log(`Requesting new data for car ${number}...`);
      axios
        .get(`/api/updateMetroCar/${number}`)
        .then((updateCarResponse) => {
          console.log(
            `New data for car ${number} received:`,
            updateCarResponse.data
          );
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
      } else {
        console.log("No network connection, using indexedDB...");
        db.transaction("rw", db.car, () => {
          console.log(
            `Checking indexedDB for record with car ${metroCarState.carNumber}...`
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
                  volume: newVolume,
                  keys: metroCarState.carKeys,
                  updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
                })
                .then((response) => {
                  console.log(
                    `Successfully updated Indexed DB record for car ${metroCarState.carNumber}`,
                    response
                  );
                });
            } else {
              console.log(
                `No record for car ${metroCarState.carNumber} found in indexedDB`
              );
              console.log(
                `Saving record for car ${metroCarState.carNumber} to indexedDB...`
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
                  console.log(
                    "Success.  Added indexedDB record for car ",
                    response
                  );
                });
            }
          });
        }).catch((err) => {
          console.log(
            `IndexedDB transaction error for car ${metroCarState.number}: `,
            err
          );
        });
      }
    };
    const iconClasses = classnames({
     shipconBrown: true,
    });
    const carClasses = classnames({
      metroCar: true,
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

    //  A MetroCar is a row on the screen with car data and can be interacted with by a user.
    return (
      <div className={carClasses}>
        <Paper className={"car-paper"} elevation={4}>
          <FormGroup row>
            <Grid container alignItems="center" justify="space-evenly">
              <Grid item xs={1}>
                <FormLabel>
                  {number.substring(0, 3).includes("998") ? (
                    <LocalShippingTwoToneIcon className={iconClasses} />
                  ) : (
                    <LocalShippingRoundedIcon className={iconClasses} />
                  )}
                </FormLabel>
              </Grid>
              <Grid className="car-number" item xs={2}>
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
                      <FormControlLabel
                        className="radio-label"
                        label="Heavy"
                        labelPlacement="top"
                        control={
                          <Radio
                            className="heavy-radio"
                            size="small"
                            value="heavy"
                          />
                        }
                      />
                      <FormControlLabel
                        className="radio-label"
                        label="Light"
                        labelPlacement="top"
                        control={
                          <Radio
                            className="light-radio"
                            size="small"
                            value="light"
                          />
                        }
                      />

                      <FormControlLabel
                        className="radio-label"
                        label="Empty"
                        labelPlacement="top"
                        control={
                          <Radio
                            className="empty-radio"
                            size="small"
                            value="empty"
                          />
                        }
                      />
                    </RadioGroup>
                  }
                />
              </Grid>
            </Grid>
          </FormGroup>
        </Paper>
      </div>
    );
  }
);
export default MetroCar;
