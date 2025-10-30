import { config as dotenvConfig } from "dotenv";
dotenvConfig();

const _config = {
  MONGO_DB_URI: process.env.MONGO_DB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
};

export default _config;
