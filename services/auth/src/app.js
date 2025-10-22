import express, { urlencoded } from "express";
import morgan from "morgan";
import cookieparser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import _config from "./config/config.js";

const app = express();

//middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use("/api/auth", authRoutes);
app.use(passport.initialize());
passport.use(
  new GoogleStrategy(
    {
      clientID: _config.CLIENT_ID,
      clientSecret: _config.CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Here, you would typically find or create a user in your database
      // For this example, we'll just return the profile
      return done(null, profile);
    }
  )
);

export default app;
