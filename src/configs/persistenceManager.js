import config from './config.js';

//mongo daos
import {CartsMongo}  from '../dao/mongo/carts.mongo.js';
import {ProductsMongo}  from '../dao/mongo/products.mongo.js';
import {UsersMongo}  from '../dao/mongo/users.mongo.js';
import {OrdersMongo} from '../dao/mongo/orders.mongo.js';

// fs daos
import {CartsFS} from '../dao/fileSystem/carts.fs.js';
import {ProductsFS} from '../dao/fileSystem/products.fs.js'
import {UsersFS} from '../dao/fileSystem/users.fs.js'
import {OrdersFS} from '../dao/fileSystem/orders.fs.js'


//session
import { fileSessionConfig, mongoSessionConfig } from  './sessionConfig.js';
//winston 
import {myCustomLogger} from './configWinston.js'


const persistencia = config.persistencia;
let mySession; 

let cartsPersistence;
let productsPersistence;
let usersPersistence;
let ordersPersistence;


if(persistencia==='mongo'){
    cartsPersistence = new CartsMongo();
    productsPersistence = new ProductsMongo();
    usersPersistence = new UsersMongo();
    ordersPersistence = new OrdersMongo();
    
    mySession = mongoSessionConfig;
} else {
    cartsPersistence = new CartsFS('carritos.json');
    productsPersistence = new ProductsFS('productos.json');
    usersPersistence = new UsersFS('usuarios.json');
    ordersPersistence = new OrdersFS('ordenes.json');
    mySession = fileSessionConfig;
    myCustomLogger.test(`Has seleccionado la presistencia en ${persistencia}. si no existen los archivos .json a veces da un error y no los crea, se soliciona si los creas manualmente
    `)
}


export {
    cartsPersistence,
    productsPersistence,
    usersPersistence,  
    ordersPersistence,  
    mySession
}

