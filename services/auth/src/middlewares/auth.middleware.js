import jwt from "jsonwebtoken";
import _config from "../config/config.js";
import userModel from "../models/user.model.js";
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(404).json({
        message: "no token found",
      });
    }

    const decoded = jwt.verify(token, _config.JWT_SECRET);
    if (!decoded) {
      return res.status(400).json({
        message: "invalid token",
      });
    }

    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
    console.log("auth middleware error: ", error);
  }
};
