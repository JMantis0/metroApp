import React from "react";
import Paper from "@material-ui/core/Paper";
import Switch from "@material-ui/core/Switch";


const MetroCar = ({ number, heavy, keys, flashers, clear }) => {
  return <Paper>{heavy ? "Heavy":"Not Heavy"}<Switch></Switch><Switch></Switch><Switch></Switch>{number}</Paper>;
};

export default MetroCar;
