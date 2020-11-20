import React from "react";

import Grid from "@material-ui/core/Grid";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import { makeStyles } from "@material-ui/core/styles";

const MetroFooter = ({ setVolumeFilterState, footerState }) => {
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
            label={footerState.uncheckedCount}
            icon="Unchecked"
          />
          <BottomNavigationAction
            value="heavy"
            label={footerState.heavyCount}
            icon="Heavy"
          />
          <BottomNavigationAction
            value="light"
            label={footerState.lightCount}
            icon={"Light"}
          />
          <BottomNavigationAction
            value="all"
            label={footerState.allCount}
            icon={"All"}
          />
          <BottomNavigationAction
            value="empty"
            label={footerState.emptyCount}
            icon="Empty"
          />
        </BottomNavigation>
      </Grid>
    </Grid>
  );
};

export default MetroFooter;
