import mongoose from "mongoose";
import _config from "../config/config.js";

const connectToDb = async () => {
  try {
    await mongoose.connect(_config.MONGO_DB_URI);
    console.log("connected to database");
  } catch (error) {
    console.log("error connecting to database : ", error);
  }
};

export default connectToDb;
