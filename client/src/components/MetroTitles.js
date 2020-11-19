import React from "react";
import Grid from "@material-ui/core/Grid";

const MetroTitles = () => {
  return (
    <Grid item xs={12}>
      <Grid container>
        <Grid item xs={4}>
          Number
        </Grid>
        <Grid item xs={4}>
          <Grid container justify="space-evenly">
            <Grid item xs={4}>Heavy</Grid>
            <Grid item xs={4}>Light</Grid>
            <Grid item xs={4}>Empty</Grid>
          </Grid>
        </Grid>
        <Grid item xs={1}>
          Keys
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MetroTitles;
