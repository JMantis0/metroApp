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
import Collapse from "@material-ui/core/Collapse";

import { makeStyles } from "@material-ui/core/styles";

const MetroCar = ({ number, heavy, keys, flashers, clear, getAllCars }) => {
  const [checked, setChecked] = useState(false);
  const [carState, setCarState] = useState({
    heavyX: heavy,
    keysX: keys,
    flashersX: flashers,
    clearX: clear,
  });
  const handleCollapse = () => {
    setChecked((prev) => !prev);
  };
  const useStyles = makeStyles(() => ({
    root: {
      width: "100%",
    },
  }));
  const classes = useStyles();

  const handleHeavyChange = () => {
    console.log("carState", carState)
    setCarState({...carState, heavyX: !carState.heavyX})
    axios
      .put("/api/toggleHeavy", { newHeavy: !heavy, num: number })
      .then((response) => {
        console.log("Response from toggleHeavy", response);
        // getAllCars();
      })
      .catch((err) => {
        console.log("There was an error in the toggleHeavy route: ", err);
      });
  };

  const handleFlashersChange = () => {
    setCarState({...carState, flashersX: !carState.flashersX})
    axios
      .put("/api/toggleFlashers", { newFlashers: !flashers, num: number })
      .then((response) => {
        console.log("Response from toggleFlashers", response);
        // getAllCars();
      })
      .catch((err) => {
        console.log("There was an error in the toggleFlashers route: ", err);
      });
  };

  const handleKeysChange = () => {
    setCarState({...carState, keysX: !carState.keysX})
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

  return (
    <Paper>
      <FormGroup row>
        <FormLabel onClick={handleCollapse}>
          <LocalShippingRoundedIcon />
          {number}{" "}
          {!carState.heavyX && !carState.flashersX && !carState.keysX && !carState.clearX 
            ? "Unchecked"
            : carState.heavyX && carState.keysX
            ? "Heavy (keys inside)"
            : carState.heavyX && !carState.keysX
            ? "Heavy (no keys)"
            : carState.flashersX
            ? "Consolidate"
            : null}
        </FormLabel>
        {/* <Collapse in={checked}> */}
        <FormGroup row>
          <FormControlLabel
            control={
              <Switch
                checked={carState.heavyX}
                onChange={handleHeavyChange}
                name="heavy"
              />
            }
            label="Heavy"
          />
          <FormControlLabel
            control={
              <Switch
                checked={carState.flashersX}
                onChange={handleFlashersChange}
                name="flashers"
              />
            }
            label="Light"
          />
          <FormControlLabel
            control={
              <Switch checked={carState.keysX} onChange={handleKeysChange} name="keys" />
            }
            label="Keys"
          />
        </FormGroup>
        {/* </Collapse> */}
        <FormHelperText></FormHelperText>
      </FormGroup>
    </Paper>
  );
};

export default MetroCar;
