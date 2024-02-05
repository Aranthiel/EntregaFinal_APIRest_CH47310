import mongoose from "mongoose"; 
import config from './config.js';
//winston 
import {myCustomLogger} from './configWinston.js'

const URI =  config.mongo_uri

mongoose.connect(URI)
.then(()=>myCustomLogger.info('Conectado a la base de datos'))
.catch((error) =>myCustomLogger.info(error));
