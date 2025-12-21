import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import morgan from "morgan";
import _config from "./src/config/config.js";

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin:true , 
    credentials: true,
  })
);
app.use(morgan("dev")); // logs incoming requests

// ✅ AUTH SERVICE
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: "http://localhost:3001",
    changeOrigin: true,
  })
);

// ✅ MUSIC SERVICE
app.use(
  "/api/music",
  createProxyMiddleware({
    target: "http://localhost:3003",
    changeOrigin: true,
  })
);

// ✅ HEALTH CHECK ROUTE
app.get("/", (req, res) => {
  res.send("🎧 API Gateway is running...");
});

// ✅ START SERVER
app.listen(3000, () => {
  console.log("🚪 API Gateway running on port 3000");
});
