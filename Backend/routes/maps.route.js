const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const mapsController = require("../controllers/map.controller");
const { query } = require("express-validator");

router.get(
  "/get-coordinates",
  [query("address").isString().withMessage("Address must be a string")],
  authMiddleware.authUser,
  mapsController.getCoordinate
);

router.get(
  "/get-distance-time",
  query("origin").isString().withMessage("Origin must be a string"),
  query("destination").isString().withMessage("Destination must be a string"),
  authMiddleware.authUser,
  mapsController.getDistanceTime
);

router.get(
  "/get-suggestions",
  authMiddleware.authUser,
  mapsController.getAutoCompleteSuggestions
);
module.exports = router;
