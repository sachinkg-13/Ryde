const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const connect = require("./db/connect");
const userRoutes = require("./routes/user.route");
const captainRoutes = require("./routes/captain.route");
const mapsRoutes = require("./routes/maps.route");
const rideRoutes = require("./routes/ride.route");

connect();

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/users", userRoutes);
app.use("/captains", captainRoutes);
app.use("/maps", mapsRoutes);
app.use("/rides", rideRoutes);

app.get("/", (req, res) => {
  res.send(
    '<body style="color:white; display:flex; justify-content:center; align-items:center; background-color:black; text-align:center;"><h1 style="color:white; background-color:black; text-align:center;">Hello World!!</h1></body>'
  );
});

module.exports = app;
