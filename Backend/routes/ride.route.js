const express = require("express");
const router = express.Router();
const rideController = require("../controllers/ride.controller");
const { body, query } = require("express-validator");
const authMiddleware = require("../middlewares/auth.middleware");
router.post(
  "/create",
  authMiddleware.authUser,
  [
    body("pickup").isString().withMessage("Pickup must be a string"),
    body("destination").isString().withMessage("Destination must be a string"),
    body("vehicleType").isString().withMessage("Vehicle type must be a string"),
  ],
  rideController.createRide
);

router.get(
  "/get-fare",
  authMiddleware.authUser,
  [
    query("pickup").isString().withMessage("Pickup must be a string"),
    query("destination").isString().withMessage("Destination must be a string"),
  ],
  rideController.getFare
);

router.post(
  "/confirm",
  authMiddleware.authCaptain,
  [body("rideId").isMongoId().withMessage("Ride ID must be a valid ID")],
  rideController.confirmRide
);

router.post(
  "/start-ride",
  authMiddleware.authCaptain,
  [
    body("rideId").isMongoId().withMessage("Invalid ride id"),
    body("otp")
      .isString()
      .isLength({ min: 6, max: 6 })
      .withMessage("Invalid OTP"),
  ],
  rideController.startRide
);

router.post(
  "/end-ride",
  authMiddleware.authCaptain,
  body("rideId").isMongoId().withMessage("Invalid ride id"),
  rideController.endRide
);

module.exports = router;
