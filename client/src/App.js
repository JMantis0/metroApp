import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Button from "@material-ui/core/Button";
import axios from "axios";

function App() {
  const testBackend = () => {
    axios
      .get("/api/test")
      .then((response) => {
        console.log("respons from test route", response);
      })
      .catch((err) => {
        console.log("There was an error: ", err);
      });
  };
  return (
    <div className="App">
      METRO APP
      <Button onClick={testBackend}>Test Backend (check console)</Button>
    </div>
  );
}

export default App;
