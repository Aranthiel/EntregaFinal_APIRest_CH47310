import dotenv from 'dotenv';
import program from "./commander.js";
//winston 
import {myCustomLogger} from './configWinston.js'

/* 
const mode = program.opts().mode;
dotenv.config({
    path:
        mode === "dev"
        ? ".env.development"
        : mode === "test"
        ? ".env.testing"
        : ".env.production",
    });
*/


dotenv.config()

/* export default{
    port: program.opts().port,
    persistencia : program.opts().db,
    env_port: process.env.PORT,
    mongo_uri: process.env.MONGO_URI,
    mongo_session_secret: process.env.MONGO_SESSION_SECRET,
    filestore_session_secret: process.env.FILESTORE_SESSION_SECRET,
    ghithub_client_id: process.env.GITHUB_CLIENT_ID,
    github_client_secret: process.env.GITHUB_CLIENT_SECRET,
    github_callback_url: process.env.GITHUB_CALLBACK_URL,
    baseURL: process.env.BASE_URL, 
    cookie_secret : process.env.COOKIE_SECRET
} */

export default{    
    env_port: process.env.PORT,
    mongo_uri: process.env.MONGO_URI,
    mongo_session_secret: process.env.MONGO_SESSION_SECRET,
    baseURL: process.env.BASE_URL, 
    cookie_secret : process.env.COOKIE_SECRET,
    jwt_secret: process.env.JWT_SECRET,
    persistencia : program.opts().db,
    express_secret : process.env.SESSION_SECRET
}