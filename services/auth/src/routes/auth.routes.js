import express from "express"
import { register } from "../controllers/auth.controller.js"
import { registerUserValidationRules } from "../middlewares/validation.middleware.js"
const router = express.Router()

router.post("/register",registerUserValidationRules,register)


export default router