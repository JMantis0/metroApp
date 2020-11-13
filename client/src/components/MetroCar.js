import React, { useEffect, useState, useMemo } from "react";

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

import { makeStyles } from "@material-ui/core/styles";

const MetroCar = ({
  number,
  keys,
  volume,
  updatedAt,
  setLastStateUpdateTime,
}) => {
  const [metroCarState, setMetroCarState] = useState({});
  const useStyles = makeStyles(() => ({
    root: {
      width: "100%",
    },
  }));

  const classes = useStyles();

  useEffect(() => {}, []);

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

  // const checkForNewData = () => {
  //   console.log("Checking for new data");
  //   return new Promise((resolve, reject) => {
  //     axios
  //       .get(`/api/checkForNewData/${metroCarState.updatedAt}`)
  //       .then((dataCheckResponse) => {
  //         console.log("Response from Datacheck route: ", dataCheckResponse);
  //         const newData = dataCheckResponse.data.newData;
  //         // console.log("newData is:", newData);
  //         resolve(newData);
  //       })
  //       .catch((dataCheckErr) => {
  //         console.log(
  //           "There was an error in the dataCheck route",
  //           dataCheckErr
  //         );
  //         reject(dataCheckErr);
  //       });
  //   }).catch((promiseError) => {
  //     console.log(
  //       "there was an error in the checkForNewData promise",
  //       promiseError
  //     );
  //   });
  // };

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

  //  This will be the updateState route
  const updateMetroCarState = () => {
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
        });
      })
      .catch((updateCarError) => {
        console.log("Error from updateMetroCar route: ", updateCarError);
      });
  };

  const handleKeysChange = (event) => {
    console.log("event.target.value", event);
    console.log("metroCarState.keys", metroCarState.carKeys);
    const newCarKeysValue = !metroCarState.carKeys;
    axios
      .put("/api/toggleKeys", { newKeys: !metroCarState.carKeys, num: number })
      .then((response) => {
        console.log("Response from toggleKeys", response);
        setMetroCarState({ ...metroCarState, carKeys: newCarKeysValue });
        setLastStateUpdateTime(Math.floor(Date.now() / 1000));
      })
      .catch((err) => {
        console.log("There was an error in the toggleKeys route: ", err);
      });
  };

  const handleRadioChange = (event) => {
    const newRadioValue = event.target.value;
    console.log("newRadioValue: ", newRadioValue);
    axios
      .put("/api/setVolumeRadio", {
        newVolume: newRadioValue,
        num: number,
      })
      .then((setVolumeRadioResponse) => {
        console.log("setVolumeRadioResponse: ", setVolumeRadioResponse);
        setMetroCarState({ ...metroCarState, carVolume: newRadioValue });
        setLastStateUpdateTime(Math.floor(Date.now() / 1000));
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
