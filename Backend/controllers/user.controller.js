const { validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const blackListTokenModels = require("../models/blackListToken.models");

module.exports.registerUser = async (req, res) => {
  console.log("Here in captain.controller.js");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { fullname, email, password } = req.body;
    const isUserExist = await userModel.findOne({ email });

    if (isUserExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
    });
    if (!user) {
      return res.status(401).json({ message: "Error creating User" });
    }

    const token = user.getAuthToken();

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = user.getAuthToken();

    res.cookie("token", token);
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message && "User login failed" });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");

    const token = req.cookies.token || req.headers.authorization.split(" ")[1];

    await blackListTokenModels.create({ token });

    res.status(201).json({ message: "User logged out" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.updateUser = async (req, res) => {};

module.exports.deleteUser = async (req, res) => {};

module.exports.getAllUsers = async (req, res) => {};
