import { program } from "commander";
//winston 
import {myCustomLogger} from './configWinston.js'

program
    .option('--db <db>', 'define el modo de persistencia de datos', 'mongo')
    .option('--port <port>', 'defiene el puerto a ejecutar', 8080)
    .parse();

const options = program.opts();

export default program;