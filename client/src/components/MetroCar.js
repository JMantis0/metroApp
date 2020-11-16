import React, { useState, useEffect, useMemo } from "react";

import axios from "axios";

import Paper from "@material-ui/core/Paper";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Switch from "@material-ui/core/Switch";
import LocalShippingRoundedIcon from "@material-ui/icons/LocalShippingRounded";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import moment from "moment";

import { makeStyles } from "@material-ui/core/styles";

const MetroCar = ({
  number,
  volume,
  keys,
  updatedAt,
  carsNeedingUpdate,
  setLastStateUpdateTime,
  lastStateUpdateTime,
  state,
}) => {
  const [metroCarState, setMetroCarState] = useState({});
  const useStyles = makeStyles(() => ({
    root: {
      width: "100%",
    },
  }));

  const classes = useStyles();

  // useEffect(() => {
  //   console.log("This car is number", number, keys, volume);
  // }, []);

  // useEffect(() => {
  //   console.log(
  //     "UseEffect triggered from change to lastStateUpdateTime... setting new interval."
  //   );
  //   const carTicker = setInterval(async () => {
  //     console.log("lastUpdateTime: ", metroCarState.updatedAt);
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
  // }, [metroCarState]);

  // const initialState =
  useMemo(() => {
    console.log("inside useMemo");
    setMetroCarState({
      carNumber: number,
      carKeys: keys,
      carVolume: volume,
      carUpdatedAt: updatedAt,
    });
  }, []);

  useEffect(() => {
    console.log("Inside useEffect with carsNeedingUpdate dependency");
    // console.log("metroCarState.number", metroCarState.carNumber);
    // console.log("carsNeedingUpdate", carsNeedingUpdate);
    if (carsNeedingUpdate.indexOf(metroCarState.carNumber) > -1) {
      console.log("cars needing update: ", carsNeedingUpdate);
      console.log("this car needs updating: ", metroCarState.carNumber);
      getNewMetroCarData();
    }
  }, [carsNeedingUpdate]);

  //  This will be the updateState route

  const getNewMetroCarData = () => {
    console.log("Function updateMetroCarState triggered for car", number);
    axios
      .get(`/api/updateMetroCar/${number}`)
      .then((updateCarResponse) => {
        console.log(
          "The response from updateMetroCar for car " +
            number +
            " request is: ",
          updateCarResponse
        );
        setMetroCarState({
          ...metroCarState,
          carVolume: updateCarResponse.data.volume,
          carKeys: updateCarResponse.data.keyz,
          carUpdatedAt: updateCarResponse.data.updatedAt,
        });
        console.log(moment(updateCarResponse.data.updatedAt).unix());
        setLastStateUpdateTime(moment(updateCarResponse.data.updatedAt).unix());
      })
      .catch((updateCarError) => {
        console.log("Error from updateMetroCar route: ", updateCarError);
      });
  };

  const handleKeysChange = (event) => {
    const newCarKeysValue = !metroCarState.carKeys;
    setMetroCarState({
      ...metroCarState,
      carKeys: newCarKeysValue,
    });

    axios
      .put("/api/toggleKeys", {
        newKeys: !metroCarState.carKeys,
        num: number,
      })
      .then((response) => {
        console.log("Response from toggleKeys", response);
        setMetroCarState({
          ...metroCarState,
          carKeys: response.data.keyz,
          carUpdatedAt: response.data.updatedAt,
        });
      })
      .catch((err) => {
        console.log("There was an error in the toggleKeys route: ", err);
      });
  };

  const handleRadioChange = (event) => {
    const newRadioValue = event.target.value;
    console.log("newRadioValue: ", newRadioValue);
    setMetroCarState({
      ...metroCarState,
      carVolume: newRadioValue,
    });
    axios
      .put("/api/setVolumeRadio", {
        newVolume: newRadioValue,
        num: number,
      })
      .then((setVolumeRadioResponse) => {
        console.log("setVolumeRadioResponse: ", setVolumeRadioResponse);

        const updatedAtUnix = moment(
          setVolumeRadioResponse.data.updatedAt
        ).unix();
        console.log(
          "trying to convert sequelize updatedAt into unix timestamp",
          updatedAtUnix
        );
        setMetroCarState({
          ...metroCarState,
          carVolume: setVolumeRadioResponse.data.volume,
          carUpdatedAt: setVolumeRadioResponse.data.updatedAt,
        });
      })
      .catch((setVolumeRadioError) => {
        console.log(
          ("There was an error in the setVolumeRadio route: ",
          setVolumeRadioError)
        );
      });
  };

  return (
    <div>
      {/* <Grid container>
        <Grid xs={4} item>
          number
        </Grid>
        <Grid xs={4} item>
          volume radio
        </Grid>
        <Grid xs={4} item>
          keys
        </Grid>
      </Grid> */}
      <Paper>
        <button
          onClick={() => {
            console.log("metroCarState:", metroCarState);
          }}
        >
          car state
        </button>
        <button onClick={getNewMetroCarData}>get new data</button>
        <FormGroup row>
          <Grid container>
            <Grid item xs={4}>
              <FormLabel>
                <LocalShippingRoundedIcon />
                {number}
              </FormLabel>
            </Grid>
            <Grid item xs={4}>
              <FormLabel>Volume</FormLabel>
              <FormControlLabel
                control={
                  <RadioGroup
                    row
                    value={metroCarState.carVolume}
                    onChange={handleRadioChange}
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
            <Grid item xs={4}>
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
          </Grid>
          <FormControl>
            <FormHelperText>
              Updated at: {metroCarState.carUpdatedAt}{" "}
            </FormHelperText>
          </FormControl>
        </FormGroup>
      </Paper>
    </div>
  );
};
export default MetroCar;
