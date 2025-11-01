import jwt from "jsonwebtoken"
import _config from "../config/config.js";
export const artsistMiddleware = async (req,res,next)=>{

    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(404).json({
                message:"token not found"
            })
        }

        const decoded = jwt.verify(token,_config.JWT_SECRET);

       if(!decoded){
        return res.status(400).json({
            message:"invalid token"
        })
       }

        if(decoded.role === "user"){
            return res.status(403).json({
                message:"forbidden"
            })
        }

        req.user = decoded

        next()
        
    } catch (error) {
        console.log("auth middleware error in music service: ",error);
        res.status(500).json({
            message:"server error"
        })
        
    }
}