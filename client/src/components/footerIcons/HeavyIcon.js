import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
const HeavyIcon = () => {
  useMemo(() => {
    console.log("inside memo of heavyIcon")
    axios
      .get("/api/totalHeavyCars")
      .then((response) => {
        console.log("response from /api/totalHeavyCars: ", response);
      })
      .catch((err) => {
        console.log("There was an error getting totalHeavyCars: ", err);
      });
  });

  return <div>Heavy</div>;
};

export default HeavyIcon;
