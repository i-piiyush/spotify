import { body, validationResult } from "express-validator"

const validate = async (req,res,next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        })
    }

    next()
}

export const registerUserValidationRules = [
 body("email").isEmail().withMessage("Invalid email address"),
 body("password").isLength({min:6}).withMessage("password must be 6 character long"),
 body("fullname").notEmpty().withMessage("Name is required"),
 validate
];