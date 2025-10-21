import {config as dotenvConfig} from "dotenv"
dotenvConfig()

const _config = {
    MONGO_DB_URI : "mongodb://localhost:27017/",
    JWT_SECRET :"6a083cbabcf4fd738c950552ca8fccd7338fe0cf89e4b8b6"

}

export default _config