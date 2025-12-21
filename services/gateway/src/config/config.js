import { config as dotenvConfig } from "dotenv";
dotenvConfig();

const _config = {
    FRONTEND_URL : process.env.FRONTEND_URL
}
export default _config;