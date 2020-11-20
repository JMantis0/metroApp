import React from "react";
import Input from "@material-ui/core/Input";

const MetroSearch = ({
  setFilteredCarState,
  searchRef,
  state,
  searchState,
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
    <div>
      <Input inputRef={searchRef} onChange={handleInputChange}></Input>
    </div>
  );
};

export default MetroSearch;
