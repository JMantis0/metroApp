import React from "react";
import Input from "@material-ui/core/Input";

const MetroSearch = ({
  searchRef,
  setSearchState,
}) => {
  let inputTimeout;
  const handleInputChange = (event) => {
    clearTimeout(inputTimeout);
    inputTimeout = setTimeout(() => {
      setSearchState(searchRef.current.value);
    }, 1500);
    //  *********************** END OF OLD WAY ******************
  };

  return (
    <div className={"metro-search"}>
      <Input fullWidth inputRef={searchRef} placeholder="Filter By Number" onChange={handleInputChange}></Input>
    </div>
  );
};

export default MetroSearch;
