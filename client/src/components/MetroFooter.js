import React from "react";

import Grid from "@material-ui/core/Grid";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import { makeStyles } from "@material-ui/core/styles";

const MetroFooter = ({ renderRef, setVolumeFilterState }) => {
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
    //  volumeFilterState filters (by setting display: none) by volume value
    console.log(`Displaying only ${value} cars.`);
    setVolumeFilterState(value);
  };

  return (
    <Grid container className={classes.root} style={{ zIndex: 10 }}>
      <Grid item xs={12}>
        <BottomNavigation
          onChange={(event, value) => {
            handleChange(event, value);
          }}
          showLabels
        >
          <BottomNavigationAction
            value="unchecked"
            label="Unchecked"
            // icon={<FitnessCenterRoundedIcon />}
          />
          <BottomNavigationAction
            value="heavy"
            label="Heavy"
            // icon={<FitnessCenterRoundedIcon />}
          />
          <BottomNavigationAction
            value="light"
            label="Light"
            // icon={<FitnessCenterRoundedIcon />}
          />
          <BottomNavigationAction
            value="all"
            label="All"
            // icon={<FitnessCenterRoundedIcon />}
          />
          <BottomNavigationAction
            value="empty"
            label="Empty"
            // icon={<FitnessCenterRoundedIcon />}
          />
        </BottomNavigation>
      </Grid>
    </Grid>
  );
};

export default MetroFooter;
