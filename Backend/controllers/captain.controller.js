const { validationResult } = require("express-validator");
const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const blackListTokenModels = require("../models/blackListToken.models");

module.exports.registerCaptain = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // console.log("Here in captain.controller.js");

  const { fullname, email, password, vehicle } = req.body;
  // console.log(fullname, email, password, vehicle, "\n");

  const isCaptainAlreadyExist = await captainModel.findOne({ email });

  // console.log("isCaptainAlreadyExist: ", isCaptainAlreadyExist);

  if (isCaptainAlreadyExist) {
    return res.status(400).json({ message: "Captain already exist" });
  }

  const hashedPassword = await captainModel.hashPassword(password);

  // console.log("VehicleType: ", vehicle.vehicleType, "\n", "Vehicle: ", vehicle);

  const captain = await captainService.createCaptain({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
    color: vehicle.color,
    plate: vehicle.plate,
    capacity: vehicle.capacity,
    vehicleType: vehicle.vehicleType,
  });
  // console.log("Captain: ", JSON.stringify(captain));

  const token = captain.generateAuthToken();
  // console.log("Token: ", token);

  res.status(201).json({ token, captain });
};

module.exports.loginCaptain = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const captain = await captainModel.findOne({ email }).select("+password");
  if (!captain) {
    return res.status(400).json({ message: "Captain not found" });
  }
  const isPasswordValid = await captain.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const token = captain.generateAuthToken();
  res.cookie("token", token);
  res.status(200).json({ token, captain });
};

module.exports.getCaptainProfile = async (req, res) => {
  const captain = await captainModel
    .findById(req.captain._id)
    .select("-password");
  if (!captain) {
    return res.status(404).json({ message: "Captain not found" });
  }
  res.status(200).json({ captain });
};

module.exports.logoutCaptain = async (req, res) => {
  res.clearCookie("token");

  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  await blackListTokenModels.create({ token });

  res.status(200).json({ message: "Captain logged out" });
};

module.exports.updateProfile = async (req, res) => {};
module.exports.deleteProfile = async (req, res) => {};
module.exports.getVehicles = async (req, res) => {};
module.exports.addVehicle = async (req, res) => {};
module.exports.updateVehicle = async (req, res) => {};
module.exports.deleteVehicle = async (req, res) => {};
