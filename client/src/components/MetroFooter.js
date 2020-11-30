import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import MetroSearch from "./MetroSearch";
import MetroFilterBanner from "./MetroFilterBanner";

const MetroFooter = ({
  setVolumeFilterState,
  footerState,
  searchRef,
  setSearchState,
  searchState,
  volumeFilterState,
}) => {
  const [inputState, setInputState] = useState("");

  const handleChange = (event, value) => {
    console.log(`Displaying only ${value} cars.`);
    setVolumeFilterState(value);
  };

  const resetNumberSearch = (event) => {
    setSearchState("");
    setInputState("");
  };

  return (
    <Grid container className={"bottom-navigation-container"}>
      <Grid item xs={12}>
        <MetroFilterBanner
          searchState={searchState}
          volumeFilterState={volumeFilterState}
        />
      </Grid>
      <MetroSearch
        inputState={inputState}
        setInputState={setInputState}
        searchRef={searchRef}
        setSearchState={setSearchState}
      />
      <Grid item xs={12}>
        <BottomNavigation
          value={volumeFilterState}
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
            onClick={resetNumberSearch}
          />
          <BottomNavigationAction
            className="navBtn"
            value="heavy"
            label={`(${footerState.heavyCount})`}
            icon="Heavy"
            onClick={resetNumberSearch}
          />
          <BottomNavigationAction
            className="navBtn"
            value="light"
            label={`(${footerState.lightCount})`}
            icon={"Light"}
            onClick={resetNumberSearch}
          />
          <BottomNavigationAction
            className="navBtn"
            value="empty"
            label={`(${footerState.emptyCount})`}
            icon="Empty"
            onClick={resetNumberSearch}
          />
          <BottomNavigationAction
            className="navBtn"
            value="all"
            label={`(${footerState.allCount})`}
            icon={"All"}
            onClick={resetNumberSearch}
          />
        </BottomNavigation>
      </Grid>
    </Grid>
  );
};

export default MetroFooter;
