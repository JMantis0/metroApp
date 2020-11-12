import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import FitnessCenterRoundedIcon from "@material-ui/icons/FitnessCenterRounded";
import { makeStyles } from "@material-ui/core/styles";

const MetroFooter = () => {
  const useStyles = makeStyles(() => ({
    root: {
      position: "fixed",
      bottom: 0,
    },
    botNav: {
      width: "100%",
    },
  }));
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        <BottomNavigation showLabels>
          <BottomNavigationAction
            value="/portfolio"
            label="Heavy"
            icon={<FitnessCenterRoundedIcon />}
          />
          <BottomNavigationAction
            value="/portfolio"
            label="Heavy"
            icon={<FitnessCenterRoundedIcon />}
          />
          <BottomNavigationAction
            value="/portfolio"
            label="Heavy"
            icon={<FitnessCenterRoundedIcon />}
          />
          <BottomNavigationAction
            value="/portfolio"
            label="Heavy"
            icon={<FitnessCenterRoundedIcon />}
          />
          <BottomNavigationAction
            value="/portfolio"
            label="Heavy"
            icon={<FitnessCenterRoundedIcon />}
          />
        </BottomNavigation>
      </Grid>
    </Grid>
  );
};

export default MetroFooter;
