import _config from "../config/config.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { publishToQueue } from "../broker/rabbit.js";

export const register = async (req, res) => {
  const { email, fullname, password, role } = req.body;

  try {
    const isUserAlreadyExists = await userModel.findOne({ email });
    if (isUserAlreadyExists) {
      return res.status(400).json({
        message: "email already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      email: email,
      fullname: fullname,
      password: hashPassword,
      role: role,
    });

    const user = await userModel.findById(newUser._id).select("-password");

    const token = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
      },
      _config.JWT_SECRET,
      { expiresIn: "2d" }
    );

    publishToQueue("newUser_created", {
      email: newUser.email,
      role: newUser.role,
      fullname: newUser.fullname,
    });

    res.cookie("token", token, {
      maxAge: 2 * 24 * 60 * 60 * 1000,
      httpOnly: _config.NODE_ENV === "production",
      secure: true,
      sameSite: "none",
    });

    res.status(201).json({
      message: "newUser created sucessfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "server error",
    });
  }
};

export const googleAuthCallback = async (req, res) => {
  const user = req.user;
  console.log(user.emails[0].value);

  const isUserAlreadyExists = await userModel.findOne({
    $or: [
      {
        email: user.emails[0].value,
        googleId: user.id,
      },
    ],
  });

  if (isUserAlreadyExists) {
    const token = jwt.sign(
      { id: isUserAlreadyExists._id, role: isUserAlreadyExists.role },
      _config.JWT_SECRET,
      {
        expiresIn: "2d",
      }
    );
    res.cookie("token", token);

    return res.redirect("http://localhost:5173/");
  }

  const newUser = await userModel.create({
    fullname: user.displayName,
    email: user.emails[0].value,
    googleId: user.id,
  });

  const token = jwt.sign(
    { id: newUser._id, role: newUser.role },
    _config.JWT_SECRET,
    {
      expiresIn: "2d",
    }
  );

  publishToQueue("user_created", {
    email: newUser.email,
    role: newUser.role,
    fullname: newUser.fullname,
  });
  res.cookie("token", token);

  res.redirect("http://localhost:5173/");
};

export const getUserProfile = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({
        message: "no user found",
      });
    }

    res.status(200).json({
      message: "user fetched sucessfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
    });

    console.log("error while fetching user: ", error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).json({
        message: "email or password can't be empty",
      });
    }

    const user = await userModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(400).json({
        message: "invalid email",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        message: "invalid password",
      });
    }

    const loggedInUser = await userModel.findById(user._id).select("-password")
    const token = jwt.sign(
      { id: user._id, role: user.role },
      _config.JWT_SECRET,
      { expiresIn: "2d" }
    );

    res.cookie("token", token, {
      maxAge: 2 * 24 * 60 * 60 * 1000,
      httpOnly: _config.NODE_ENV === "production",
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      message: "user logged in sucessfully",
      user:loggedInUser
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
    });
  }
};
