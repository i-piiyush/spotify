import express from "express";
import { googleAuthCallback, register } from "../controllers/auth.controller.js";
import { registerUserValidationRules } from "../middlewares/validation.middleware.js";
import passport from "passport";
const router = express.Router();

router.post("/register", registerUserValidationRules, register);


// Route to initiate Google OAuth flow
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback route that Google will redirect to after authentication
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleAuthCallback
);

export default router;
