import React, { useEffect, useState } from "react";

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

const MetroCar = ({ number }) => {
  const [radioState, setRadioState] = useState(null);
  const [metroCarState, setMetroCarState] = useState({});

  const useStyles = makeStyles(() => ({
    root: {
      width: "100%",
    },
  }));

  const classes = useStyles();

  //  This will be the updateState route
  const updateMetroCarState = () => {
    console.log("Function updateMetroCarState triggered.");
    axios
      .get(`/api/updateMetroCar/${number}`)
      .then((updateCarResponse) => {
        console.log(
          "The response from updateMetroCar request is: ",
          updateCarResponse
        );
      })
      .catch((updateCarError) => {
        console.log("Error from updateMetroCar route: ", updateCarError);
      });
  };

  const toggleHeavyDB = () => {
    axios
      .put("/api/toggleHeavy", { newHeavy: !metroCarState.heavy, num: number })
      .then((response) => {
        console.log("Response from toggleHeavy", response);
        updateMetroCarState();
      })
      .catch((err) => {
        console.log("There was an error in the toggleHeavy route: ", err);
      });
  };

  //  THIS ROUTE MAY BECOME OBSOLETE SOON
  // const toggleFlashersDB = () => {
  //   axios
  //     .put("/api/toggleFlashers", {
  //       newFlashers: !flashers,
  //       num: number,
  //     })
  //     .then((response) => {
  //       console.log("Response from toggleFlashers", response);
  //       getAllCars();
  //     })
  //     .catch((err) => {
  //       console.log("There was an error in the toggleFlashers route: ", err);
  //     });
  // };

  const handleKeysChange = () => {
    axios
      .put("/api/toggleKeys", { newKeys: !metroCarState.keys, num: number })
      .then((response) => {
        console.log("Response from toggleKeys", response);
        // getAllCars();
        
      })
      .catch((err) => {
        console.log("There was an error in the toggleKeys route: ", err);
      });
  };

  const handleRadioChange = (event) => {
    setRadioState(event.target.value);
    axios
      .put("/api/setVolumeRadio", {
        newVolume: event.target.value,
        num: number,
      })
      .then((setVolumeRadioResponse) => {
        console.log("setVolumeRadioResponse: ", setVolumeRadioResponse);
        updateMetroCarState();
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
              <RadioGroup row value={metroCarState.volume} onChange={handleRadioChange}>
                <Radio value="heavy" />
                <Radio value="light" />
                <Radio value="empty" />
              </RadioGroup>
            </Grid>
            <Grid item xs={4}>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={metroCarState.keys}
                    onChange={handleKeysChange}
                    name="keys"
                  />
                }
                label="Keys"
              />
            </Grid>
          </Grid>
          <FormControl>
            <FormHelperText>Updated by: user at 5:00</FormHelperText>
          </FormControl>
        </FormGroup>
      </Paper>
    </div>
  );
};

export default MetroCar;
