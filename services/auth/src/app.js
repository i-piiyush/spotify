import express, { urlencoded } from "express"
import morgan from "morgan"
import cookieparser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"


const app = express()

//middlewares 
app.use(express.json())
app.use(morgan("dev"))
app.use(express.urlencoded({extended:true}))
app.use(cookieparser())
app.use("/api/auth",authRoutes)


export default app
