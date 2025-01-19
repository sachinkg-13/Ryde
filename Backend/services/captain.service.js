const captainModel = require("../models/captain.model");

module.exports.createCaptain = async ({
  firstname,
  lastname,
  email,
  password,
  color,
  plate,
  capacity,
  vehicleType,
}) => {
  if (!firstname) {
    throw new Error("Firstname is required in captain service");
  } else if (!email) {
    throw new Error("Email is required in captain service");
  } else if (!password) {
    throw new Error("Password is required in captain service");
  } else if (!color) {
    throw new Error("Color is required in captain service");
  } else if (!plate) {
    throw new Error("Plate is required in captain service");
  } else if (!capacity) {
    throw new Error("Capacity is required in captain service");
  } else if (!vehicleType) {
    throw new Error("Vehicle type is required in captain service");
  }
  const captain = captainModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
    vehicle: {
      color,
      plate,
      capacity,
      vehicleType,
    },
  });

  return captain;
};
