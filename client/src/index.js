import React, { Suspense, lazy} from "react";
import ReactDOM from "react-dom";
import "./index.css";
import MetroApp from "./MetroApp";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<MetroApp />, document.getElementById("root"));
registerServiceWorker();
