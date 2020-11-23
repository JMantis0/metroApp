import React from "react";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

const MetroSearch = ({ searchRef, setSearchState, inputState, setInputState }) => {
  const handleInputChange = (event) => {
    setInputState(searchRef.current.value);
  };

  const handleSubmit = (event) => {
    setSearchState(searchRef.current.value);
  };
  const handleClear = (event) => {
    setInputState("");
    setSearchState("");
  };

  return (
    <div className={"metro-search"}>
      <Grid container 
      justify="space-around"
      >
        <Grid item xs={7}>
          <Input
            id="searchInput"
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                handleSubmit(event);
              }
            }}
            inputProps={{
              type: "number",
              pattern: "[0-9]",
              inputMode: "numeric",
              className: "search-input",
            }}
            value={inputState}
            inputRef={searchRef}
            placeholder="Filter By Number"
            onChange={handleInputChange}
          ></Input>
        </Grid>
        <Grid item xs={"auto"}>
          <Button
            className="searchBtn"
            variant="contained"
            onClick={handleSubmit}
            type="submit"
          >
            Go
          </Button>
        </Grid>
        <Grid item xs={"auto"}>
          <Button
            className="searchBtn"
            variant="contained"
            onClick={handleClear}
            type="submit"
          >
            Clear
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default MetroSearch;
