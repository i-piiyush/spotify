import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { router as musicRoutes } from "./routes/music.routes.js";

const app = express();

// middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/music",musicRoutes)


export default app;
