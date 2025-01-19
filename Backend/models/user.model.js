const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new Schema(
  {
    fullname: {
      firstname: {
        type: String,
        required: [true, "First name is required"],
        minLength: [2, "First name must be at least 2 characters long"],
      },
      lastname: {
        type: String,
        // required:[true,'Last name is required'],
        minLenght: [2, "Last name must be at least 2 characters long"],
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      minLength: [6, "Email must be at least 6 characters long"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    socketId: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.methods.getAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 8);
};

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
