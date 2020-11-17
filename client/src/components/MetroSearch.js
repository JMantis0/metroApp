import React, { useState, useEffect, useRef } from "react";
import Input from "@material-ui/core/Input";

const MetroSearch = ({ setFilteredCarState, searchRef, state }) => {
  let inputTimeout;
  const handleInputChange = (event) => {
    console.log(`The searchRef.current.value is: ${searchRef.current.value}`);
    console.log(`The event.target.value is ${event.target.value}`);
    console.log(
      `searchRef.current.value === "" evaluates to ${searchRef.current.value ===
        ""}`
    );
  };

  return (
    <div>
      <Input inputRef={searchRef} onChange={handleInputChange}></Input>
    </div>
  );
};

export default MetroSearch;
