import React, { memo, useState, useEffect, useMemo, useRef } from "react";

import axios from "axios";

import Paper from "@material-ui/core/Paper";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import LocalShippingRoundedIcon from "@material-ui/icons/LocalShippingRounded";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import moment from "moment";
import classnames from "classnames";

import { makeStyles } from "@material-ui/core/styles";

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
  }) => {
    const [metroCarState, setMetroCarState] = useState({});
    const numberRef = useRef("");

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
    };

    const handleVolumeChange = (event) => {
      const newVolume = event.target.value;
      console.log(`Client changed car ${number} volume to ${newVolume}`);
      setMetroCarState({
        ...metroCarState,
        carVolume: newVolume,
      });
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

          const updatedAtUnix = moment(setVolumeResponse.data.updatedAt).unix();
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
    };

    //  A MetroCar is a row on the screen with car data and can be interacted with by a user.
    return (
      <div className={carClasses}>
        <Paper>
          <FormGroup row>
            <Grid container alignItems="center" justify="space-evenly">
              <Grid item xs={1}>
                <FormLabel>
                  <LocalShippingRoundedIcon className="shipcon" />
                </FormLabel>
              </Grid>
              <Grid className="car-number" item xs={3}>
                {number}
              </Grid>
              <Grid item xs={4}>
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
