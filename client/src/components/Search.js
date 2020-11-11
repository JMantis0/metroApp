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

  const handleInputChange = (event) => {
    setFilteredCarState(
      state.filter((car) => car.num.includes(searchRef.current.value))
    );
  };
  return (
    <div>
      <button
        onClick={() => {
          console.log("filteredCarState: ", filteredCarState);
        }}
      >
        Filtered Car State
      </button>
      <Input
        inputRef={searchRef}
        onChange={handleInputChange}
      ></Input>
    </div>
  );
};

export default Search;
