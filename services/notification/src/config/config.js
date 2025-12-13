import { config as dotenvConfig } from "dotenv";
dotenvConfig();

const _config = {
  
  CLIENT_ID : process.env.CLIENT_ID,
  CLIENT_SECRET : process.env.CLIENT_SECRET,
  REFRESH_TOKEN : process.env.REFRESH_TOKEN,
  EMAIL_USER : process.env.EMAIL_USER,
  RABBITMQ_URI : process.env.RABBITMQ_URI,
  GMAIL_PASSWORD :process.env.GMAIL_PASSWORD
};

export default _config;
