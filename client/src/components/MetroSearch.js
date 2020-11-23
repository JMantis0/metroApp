import React, { useState } from "react";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

const MetroSearch = ({ searchRef, setSearchState, searchState }) => {
  const [inputState, setInputState] = useState("");
  const handleInputChange = (event) => {
    console.log("inputChange event... is there a value here?: ", event);
    setInputState(searchRef.current.value);
  };

  const handleSubmit = (event) => {
    console.log("handleSubmit event... is there a value here?: ", event);
    setSearchState(searchRef.current.value);
  };
  const handleClear = (event) => {
    console.log("handleClear event... is there a value here?: ", event);
    setInputState("");
    setSearchState("");
  };

  return (
    <div className={"metro-search"}>
      <Grid container>
        <Grid item xs={6}>
          <Input
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                handleSubmit(event);
              }
              console.log("onkeypress");
              console.log("event", event);
              console.log("event.key", event.key);
              console.log("typeof event.key", typeof event.key);
              console.log("event.key === 'Enter'", event.key === "Enter");
            }}
            inputProps={{
              type: "number",
              pattern: "[0-9]",
              inputMode: "numeric",
            }}
            value={inputState}
            fullWidth
            inputRef={searchRef}
            placeholder="   Filter By Number"
            onChange={handleInputChange}
            onSubmit={handleSubmit}
          ></Input>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" onClick={handleSubmit} type="submit">
            Go
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" onClick={handleClear} type="submit">
            Clear
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default MetroSearch;
