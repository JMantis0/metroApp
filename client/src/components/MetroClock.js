import React, { useState, useMemo } from "react";
import moment from "moment";

const MetroClock = () => {
  const [time, setTime] = useState("");
  useMemo(() => {
    let clock;
    clearInterval(clock);
    clock = setInterval(() => {
      setTime(moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
    }, 1000);
  }, []);
  return <div id={"clock"}>{time}</div>;
};

export default MetroClock;
