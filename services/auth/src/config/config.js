import { config as dotenvConfig } from "dotenv";
dotenvConfig();

const _config = {
  MONGO_DB_URI: process.env.MONGO_DB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  CLIENT_ID : process.env.CLIENT_ID,
  CLIENT_SECRET : process.env.CLIENT_SECRET,
  RABBITMQ_URI : process.env.RABBITMQ_URI,
  NODE_ENV : process.env.NODE_ENV
};

export default _config;
