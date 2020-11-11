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

const MetroCar = ({ number, heavy, keys, flashers, clear, getAllCars }) => {
  const [radioState, setRadioState] = useState(null);

  const useStyles = makeStyles(() => ({
    root: {
      width: "100%",
    },
  }));
  const classes = useStyles();

  const toggleHeavyDB = () => {
    axios
      .put("/api/toggleHeavy", { newHeavy: !heavy, num: number })
      .then((response) => {
        console.log("Response from toggleHeavy", response);
        getAllCars();
      })
      .catch((err) => {
        console.log("There was an error in the toggleHeavy route: ", err);
      });
  };

  const toggleFlashersDB = () => {
    axios
      .put("/api/toggleFlashers", {
        newFlashers: !flashers,
        num: number,
      })
      .then((response) => {
        console.log("Response from toggleFlashers", response);
        getAllCars();
      })
      .catch((err) => {
        console.log("There was an error in the toggleFlashers route: ", err);
      });
  };

  const handleKeysChange = () => {
    axios
      .put("/api/toggleKeys", { newKeys: !keys, num: number })
      .then((response) => {
        console.log("Response from toggleKeys", response);
        // getAllCars();
      })
      .catch((err) => {
        console.log("There was an error in the toggleKeys route: ", err);
      });
  };

  const handleRadioChange = (event) => {
    console.log(event.target.value);
    setRadioState(event.target.value);
  };

  return (
    <div>
      <Grid container>
        <Grid item>number</Grid>
        <Grid item>volume radio</Grid>
        <Grid item>keys</Grid>
      </Grid>
      <FormControl>
        <FormLabel>Volume</FormLabel>
        <RadioGroup row onChange={handleRadioChange}>
          <Radio value="light" />
          <Radio value="heavy" />
          <Radio value="empty" />
        </RadioGroup>
      </FormControl>
      <Paper>
        <FormGroup row>
          <FormLabel>
            <LocalShippingRoundedIcon />
            {number}
            {/* {" "} */}
            {/* {!carState.heavyX &&
          !carState.flashersX &&
          !carState.keysX &&
          !carState.clearX
            ? "Unchecked"
            : carState.heavyX && carState.keysX
            ? "Heavy (keys inside)"
            : carState.heavyX && !carState.keysX
            ? "Heavy (no keys)"
            : carState.flashersX
            ? "Consolidate"
            : null} */}
          </FormLabel>
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={heavy}
                  onChange={handleHeavyChange}
                  name="heavy"
                />
              }
              label="Heavy"
            />
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={flashers}
                  onChange={handleFlashersChange}
                  name="flashers"
                />
              }
              label="Light"
            />
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={keys}
                  onChange={handleKeysChange}
                  name="keys"
                />
              }
              label="Keys"
            />
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={keys}
                  onChange={handleEmptyChange}
                  name="empty"
                />
              }
              label="Empty"
            />
          </FormGroup>
          <FormHelperText></FormHelperText>
        </FormGroup>
      </Paper>
    </div>
  );
};

export default MetroCar;
