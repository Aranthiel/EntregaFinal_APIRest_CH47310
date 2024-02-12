//conexion a la base de datos //mongoose
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
//import viewsRouter from './routes/views.routes.js';

//documentación
import swaggerUi from 'swagger-ui-express'
import {swaggerSetup} from './configs/configSwagger.js';


////////////////////////  mi app //////////////////////////////////////
const app = express();
const PORT=config.env_port;
const cookieSecret=config.cookie_secret;
const BASE_URL=config.baseURL


//1) cargar archivos de rutas






// 2) Middleware para que Express pueda analizar el cuerpo de las solicitudes
//IMPORTANTE siempre tiene que estar definido ANTES DE LAS RUTAS
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));

// 3) configurar CORS


// 4) acceder a la configuración de rutas
app.use("/api", apiRouter);
//app.use("/", viewsRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSetup)); // si pongo /api/docs me da un error

// PENULTIMO: Inicia el servidor
const httpServer = app.listen(PORT, ()=>(
    myCustomLogger.info(`Pruebas server express. Servidor escuchando en http://localhost:${PORT}/home `)
));

// ULTIMO: inicia soket.io

export default app;