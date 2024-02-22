//conexion a la base de datos mongoose
import "./configs/dbconfig.js";

//inicializar server express
import express from 'express';

//variables de entorno
import config from './configs/config.js'

//winston logger
import { myCustomLogger} from './configs/configWinston.js';
import { __dirname } from './utils.js';

//routes
import apiRouter from './routes/api.routes.js';
import viewsRouter from './routes/views.routes.js';

//documentación
import swaggerUi from 'swagger-ui-express'
import {swaggerSetup} from './configs/configSwagger.js';

//handlebars'
import { engine } from "express-handlebars";
import path from 'path';

//socket.io 
import { initializeSocket } from "./socket/socketServer.js";

// session
import session from "express-session";
import {mySession}from './configs/persistenceManager.js';

//coockie parser
//session
//CORS
//passport
import passport from 'passport';
import './configs/passportConfig.js';

//


////////////////////////  mi app //////////////////////////////////////
const app = express();
const PORT=config.env_port;
const cookieSecret=config.cookie_secret;
const BASE_URL=config.baseURL

// Middleware para que Express pueda analizar el cuerpo de las solicitudes
//IMPORTANTE siempre tiene que estar definido ANTES DE LAS RUTAS
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));

//handlebars
app.engine("handlebars", engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

// session
//IMPORTANTE siempre tiene que estar definido ANTES DE LAS RUTAS
app.use(session(mySession));

//passport 
//SIEMPRE tiene que estar declarado despues de session para que funcione correctamente!
app.use(passport.initialize());
app.use(passport.session());

// RUTAS
app.use("/api", apiRouter);
app.use("/", viewsRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSetup)); // si pongo /api/docs me da un error

// PENULTIMO: Inicia el servidor
const httpServer = app.listen(PORT, ()=>(
    myCustomLogger.info(`Pruebas server express. Servidor escuchando en http://localhost:${PORT}/home `)
));

//const socketServer = new Server(httpServer);
initializeSocket(httpServer);

export default app;