import React from "react";

import Paper from "@material-ui/core/Paper";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import LocalShippingRoundedIcon from "@material-ui/icons/LocalShippingRounded";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

const MetroTitles = () => {
  return (
    <div>
        <Paper>
          <FormGroup row>
            <Grid container alignItems="center" justify="space-evenly">
              <Grid item xs={"auto"}>
                <FormLabel>
                  <LocalShippingRoundedIcon className="shipcon" />
                </FormLabel>
              </Grid>
              <Grid className="car-number" item xs={"auto"}>
                {" Number "}
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  control={
                    <RadioGroup
                      row
                      justify="space-around"
                    >
                      <Radio
                        className="heavy-radio"
                        size="small"
                        value="heavy"
                        selected
                      />
                      <Radio
                        className="light-radio"
                        size="small"
                        value="light"
                        selected
                      />
                      <Radio
                        className="empty-radio"
                        size="small"
                        value="empty"
                        selected
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
                      name="keys"
                    />
                  }
                />
              </Grid>
              <Grid item xs={"auto"}>
                {/* {moment(metroCarState.carUpdatedAt).format("hh:mm:ss a")} */}
              </Grid>
            </Grid>
          </FormGroup>
        </Paper>
      </div>
  );
};

export default MetroTitles;
