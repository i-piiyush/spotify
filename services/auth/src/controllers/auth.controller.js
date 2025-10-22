import { response } from "express";
import _config from "../config/config.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { email, fullname, password } = req.body;

  try {
    const isUserAlreadyExists = await userModel.findOne({ email });
    if (isUserAlreadyExists) {
      return res.status(400).json({
        message: "email already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      email: email,
      fullname: fullname,
      password: hashPassword,
    });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      _config.JWT_SECRET,
      { expiresIn: "2d" }
    );

    res.cookie("token", token);

    res.status(201).json({
      message: "user created sucessfully",
      email: user.email,
      role: user.role,
      fullname: user.fullname,
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
  console.log( user.emails[0].value);
  
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
      { id: isUserAlreadyExists._id, role:isUserAlreadyExists.role },
      _config.JWT_SECRET,
      {
        expiresIn: "2d",
      }
    );
    res.cookie("token", token);
    
    return res.status(200).json({
      message: "user logged in",
    });
  }

  const newUser = await userModel.create({
    fullname: user.displayName,
    email: user.emails[0].value,
    googleId: user.id,
  });

  const token = jwt.sign(
    { id: newUser._id, role:newUser.role },
    _config.JWT_SECRET,
    {
      expiresIn: "2d",
    }
  );
  res.cookie("token", token);
  
  res.status(201).json({
    message: "new user created",
    email: newUser.email,
    name: newUser.fullname,
  });
};
