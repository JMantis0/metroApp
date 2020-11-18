const express = require("express");
const path = require("path");
const logger = require("morgan");

const PORT = process.env.PORT || 4000;
const app = express();
app.use(logger("dev"));
const apiRoutes = require("./routes/apiRoutes");

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
app.use(express.static("public"));
if (process.env.NODE_ENV === "production") {
  console.log("serving in PRODUCTION MODE");
  app.use(express.static("client/build"));
}

// Define API routes here
app.use("/api", apiRoutes);

// Send every other request to the React app
// Define any API routes before this runs
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});
