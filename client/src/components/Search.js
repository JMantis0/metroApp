import React, { useState } from "react";
import Input from "@material-ui/core/Input";

const Search = ({ getInputState, onChange }) => {
  const [inputState, setInputState] = useState("");

  const handleInputChange = (event) => {
    console.log("event.target.value", event.target.value);
    setInputState(event.target.value);
    onChange(inputState);
  };
  return (
    <div>
      <Input value={inputState} onChange={handleInputChange}></Input>
    </div>
  );
};

export default Search;
