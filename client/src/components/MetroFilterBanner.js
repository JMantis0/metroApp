import React from "react";

const MetroFilterBanner = ({ volumeFilterState, searchState }) => {
  return (
    <div>
      <div className="banner">
        Displaying <strong>{volumeFilterState}</strong>
        {" cars"}
  {searchState !== "" ? ` with numbers ${searchState}` : "."}
      </div>
    </div>
  );
};

export default MetroFilterBanner;
