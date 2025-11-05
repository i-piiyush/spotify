import express from "express";
import { getAllMusic, musicUpload } from "../controllers/music.controller.js";
import multer from "multer";
import { artsistMiddleware, authMiddleware } from "../middlewares/auth.middleware.js";
const upload = multer({
  storage: multer.memoryStorage(),
});

export const router = express.Router();

router.post(
  "/",
  artsistMiddleware,
  upload.fields([
    {name: "audio",maxCount: 1},
    {name: "coverArt",maxCount: 1,},
  ]),
  musicUpload
);

router.get("/fetch",authMiddleware,getAllMusic);