const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const captainModel = require("../models/captain.model");

module.exports.authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized token" });
    }
    const isBlackListed = await userModel.findOne({ token: token });

    if (isBlackListed) {
      return res.status(401).json({ message: "Unauthorized " });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);
    req.user = user;
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized access" });
  }
};
module.exports.authCaptain = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized token" });
    }
    const isBlackListed = await captainModel.findOne({ token: token });

    if (isBlackListed) {
      return res.status(401).json({ message: "Unauthorized " });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await captainModel.findById(decoded._id);
    req.captain = captain;
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized access" });
  }
};
