const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

async function connect() {
  // Connect to the database
  try {
    await mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("Connected to the database");
    });
    // console.log("Connected to the database");
  } catch (error) {
    console.log("Error connecting to the database", error);
  }
}
module.exports = connect;
