import React from "react";

import axios from "axios";

import Paper from "@material-ui/core/Paper";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Switch from "@material-ui/core/Switch";

import { makeStyles } from "@material-ui/core/styles";

const MetroCar = ({ number, heavy, keys, flashers, clear }) => {
  const handleHeavyChange = () => {
    axios
      .put("/api/toggleHeavy", { newHeavy: !heavy, num: number })
      .then((response) => {
        console.log("Response from toggleHeavy", response);
      })
      .catch((err) => {
        console.log("There was an error in the toggleHeavy route: ", err);
      });
  };

  const handleChange = () => {
    console.log("change");
  };
  return (
    <Paper>
      {number}
      <FormControl component="fieldset">
        <FormLabel component="legend">Assign responsibility</FormLabel>
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
                onChange={handleChange}
                name="flashers"
              />
            }
            label="Flashers"
          />
          <FormControlLabel
            control={
              <Switch checked={keys} onChange={handleChange} name="keys" />
            }
            label="Keys"
          />
        </FormGroup>
        <FormHelperText>Be careful</FormHelperText>
      </FormControl>
    </Paper>
  );
};

export default MetroCar;
