import React from "react";

import Grid from "@material-ui/core/Grid";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import MetroSearch from "./MetroSearch";

const MetroFooter = ({
  setVolumeFilterState,
  footerState,
  searchRef,
  setSearchState,
}) => {
  const handleChange = (event, value) => {
    //  volumeFilterState filters (by setting display: none) by volume value
    console.log(`Displaying only ${value} cars.`);
    setVolumeFilterState(value);
    // searchRef.current = "";
    // setSearchState("");
  };

  return (
    <Grid
      container
      className={"bottom-navigation-container"}
      style={{ zIndex: 10 }}
    >
      <MetroSearch
        searchRef={searchRef}
        setSearchState={setSearchState}
      />
      <Grid item xs={12}>
        <BottomNavigation
          className="bottom-navigation"
          onChange={(event, value) => {
            handleChange(event, value);
          }}
          showLabels
        >
          <BottomNavigationAction
            className="navBtn"
            value="unchecked"
            label={`(${footerState.uncheckedCount})`}
            icon="Unchecked"
          />
          <BottomNavigationAction
            className="navBtn"
            value="heavy"
            label={`(${footerState.heavyCount})`}
            icon="Heavy"
          />
          <BottomNavigationAction
            className="navBtn"
            value="light"
            label={`(${footerState.lightCount})`}
            icon={"Light"}
          />
          <BottomNavigationAction
            className="navBtn"
            value="empty"
            label={`(${footerState.emptyCount})`}
            icon="Empty"
          />
          <BottomNavigationAction
            className="navBtn"
            value="all"
            label={`(${footerState.allCount})`}
            icon={"All"}
          />
        </BottomNavigation>
      </Grid>
    </Grid>
  );
};

export default MetroFooter;
