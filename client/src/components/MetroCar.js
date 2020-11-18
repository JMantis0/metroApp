import React, { memo, useState, useEffect, useMemo, useCallback } from "react";

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

import { makeStyles } from "@material-ui/core/styles";

const MetroCar = memo(
  ({
    number,
    volume,
    keys,
    updatedAt,
    carsNeedingUpdate,
    setLastStateUpdateTime,
    searchRef,
    searchState,
    heavyOnly,
    renderRef,
  }) => {
    const [metroCarState, setMetroCarState] = useState({});

    const useStyles = makeStyles(() => ({
      root: {
        width: "100%",
        backgroundColor: "#eeff00",
      },
      invisible: {
        display: "none",
      },
    }));

    const classes = useStyles();

    // On first render, this useMemo
    // sets the metroCarState to props values.
    useMemo(() => {
      // console.log(`Setting state for car ${number}`);
      setMetroCarState({
        carNumber: number,
        carKeys: keys,
        carVolume: volume,
        carUpdatedAt: updatedAt,
        carInvisible: false,
      });
    }, []);

    // When searchState changes, this useEffect
    // checks if the car number includes the string from searchRef
    // and then triggers a render by resetting state.
    useEffect(() => {
      if (
        number.toString().includes(searchRef.current.value) ||
        searchRef.current.value === ""
      ) {
        setMetroCarState({ ...metroCarState });
      }
    }, [searchState]);

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

    useEffect(() => {
      console.log("renderRef.current", renderRef.current);
      if (renderRef.current < 1) {
        //  Render only heavies
        console.log("heavyOnly changed");
        console.log(
          "is metroCarState.carVolume heavy?",
          metroCarState.carVolume
        );
        if (metroCarState.carVolume !== "heavy") {
          setMetroCarState({ ...metroCarState, carInvisible: true });
        }
      }
    }, [heavyOnly]);

    //  This will be the setMetroCarState route

    const getNewMetroCarData = () => {
      console.log(`Requesting new data for car ${number}...`);
      axios
        .get(`/api/updateMetroCar/${number}`)
        .then((updateCarResponse) => {
          console.log("Car data obtained", updateCarResponse);
          console.log(`Setting state for car ${number} `);
          setMetroCarState({
            ...metroCarState,
            carVolume: updateCarResponse.data.volume,
            carKeys: updateCarResponse.data.keyz,
            carUpdatedAt: updateCarResponse.data.updatedAt,
          });
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

    const hideIfNonHeavy = () => {
      if (metroCarState.Volume !== "heavy") {
        setMetroCarState({ ...metroCarState, carInvisible: true });
      }
    };

    //  A MetroCar is a row on the screen with car data and can be interacted with by a user.
    return (
      <div
        className={
          number.toString().includes(searchRef.current.value) ||
          searchRef.current.value === ""
            ? classes.root
            : classes.invisible
        }
        style={metroCarState.carInvisible ? { display: "none" } : {}}
      >
        <Paper>
          <FormGroup row>
            <Grid container>
              <Grid item xs={"auto"}>
                <FormLabel>
                  <LocalShippingRoundedIcon />
                </FormLabel>
              </Grid>
              <Grid item xs={"auto"}>
                {number}
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  control={
                    <RadioGroup
                      row
                      value={metroCarState.carVolume}
                      onChange={handleVolumeChange}
                    >
                      <Radio value="unchecked" />
                      <Radio value="heavy" />
                      <Radio value="light" />
                      <Radio value="empty" />
                    </RadioGroup>
                  }
                  label="Volume"
                />
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={metroCarState.carKeys}
                      onChange={handleKeysChange}
                      name="keys"
                    />
                  }
                  label="Keys"
                />
              </Grid>
              <Grid item xs={"auto"}>
                Updated{" "}
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
