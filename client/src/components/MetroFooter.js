import React from "react";

import Grid from "@material-ui/core/Grid";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import FitnessCenterRoundedIcon from "@material-ui/icons/FitnessCenterRounded";
import { makeStyles } from "@material-ui/core/styles";

const MetroFooter = ({ renderRef }) => {
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
  const handleChange = (event, value) => {
    console.log(`BottomNavigationAction ${value} with label has been clicked.`);
    console.log(`Event: " ${event}`, event);
  };

  return (
    <Grid container className={classes.root} style={{ zIndex: 10 }}>
      <Grid item xs={12}>
        <BottomNavigation
          onChange={(event, value) => {
            handleChange(event, value);
            renderRef.current = renderRef.current + 1;
          }}
          showLabels
        >
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
            value="/mouse"
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
