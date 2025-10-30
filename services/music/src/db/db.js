import mongoose from "mongoose";
import _config from "../config/config.js";

export const connectToDB = () => {
  mongoose
    .connect(_config.MONGO_DB_URI)
    .then(() => {
      console.log("mongo db connected to music service sucessfully");
    })
    .catch((err) => {
      console.log("error conencting db: ", err);
    });
};
