import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import MetroApp from "./MetroApp";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<MetroApp />, document.getElementById("root"));
console.log("Registering service workers");
registerServiceWorker();
