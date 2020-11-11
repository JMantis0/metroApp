import React, { useState, useEffect, useRef } from "react";
import Input from "@material-ui/core/Input";

const Search = ({
  filteredCarState,
  setFilteredCarState,
  getFilteredCars,
  onChange,
  state,
}) => {
  const [inputState, setInputState] = useState("");
  const searchRef = useRef("");
  let inputTimeout;

  const handleInputChange = (event) => {
    console.log("event", event);
    //  I want to implement a timeout here that will delay the state being updated to avoid lag
    clearTimeout(inputTimeout);
    inputTimeout = setTimeout(() => {
      setFilteredCarState(
        state.filter((car) => car.num.includes(searchRef.current.value))
      );
    }, 1500);
  };

  return (
    <div>
      <Input inputRef={searchRef} onChange={handleInputChange}></Input>
    </div>
  );
};

export default Search;
