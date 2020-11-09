import React, { useEffect } from "react";

import axios from "axios";

import Paper from "@material-ui/core/Paper";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Switch from "@material-ui/core/Switch";

import { makeStyles } from "@material-ui/core/styles";

const MetroCar = ({ number, heavy, keys, flashers, clear, getAllCars }) => {
  // useEffect(() => {
  // console.log(`useEffect triggered for MetroCar ${number}`)
  // });
  const handleHeavyChange = () => {
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

  const handleFlashersChange = () => {
    axios
      .put("/api/toggleFlashers", { newFlashers: !flashers, num: number })
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
        getAllCars();
      })
      .catch((err) => {
        console.log("There was an error in the toggleKeys route: ", err);
      });
  };

  return (
    <Paper>
      {number}
      <FormControl component="fieldset">
        <FormLabel component="legend">FormLabel text</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
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
                checked={flashers}
                onChange={handleFlashersChange}
                name="flashers"
              />
            }
            label="Flashers"
          />
          <FormControlLabel
            control={
              <Switch checked={keys} onChange={handleKeysChange} name="keys" />
            }
            label="Keys"
          />
        </FormGroup>
        <FormHelperText>FormHelperText</FormHelperText>
      </FormControl>
    </Paper>
  );
};

export default MetroCar;
