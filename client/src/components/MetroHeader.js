import React from "react";
//  component imports
import MetroClock from "./MetroClock";

const MetroHeader = ({ handleCollapse }) => {
  return (
    <div className="metro-header">
      <div className="title" onClick={handleCollapse}>
        <span className="big-letter">M</span>ETRO{" "}
        <span className="big-letter">A</span>PP
      </div>
      <MetroClock />
    </div>
  );
};

export default MetroHeader;
