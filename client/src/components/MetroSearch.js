import React, { useState, useEffect, useRef } from "react";
import Input from "@material-ui/core/Input";

const MetroSearch = ({
  setFilteredCarState,
  searchRef,
  state,
}) => {
  let inputTimeout;
  const handleInputChange = (event) => {
    console.log("event", event);
    //  I want to implement a timeout here that will delay the state being updated to avoid lag
    clearTimeout(inputTimeout);
    const filteredKeys = Object.keys(state).filter((key) =>
      key.includes(searchRef.current.value)
    );
    console.log(
      `The filtered keys containing ${searchRef.current.value} are: `,
      filteredKeys
    );

    const filteredStateObject = {};
    filteredKeys.forEach((key) => {
      filteredStateObject[key] = state[key];
    });

    console.log("The filteredStateObject is: ", filteredStateObject);
    inputTimeout = setTimeout(() => {
      setFilteredCarState(filteredStateObject);
    }, 1500);
  };

  return (
    <div>
      <Input inputRef={searchRef} onChange={handleInputChange}></Input>
    </div>
  );
};

export default MetroSearch;
