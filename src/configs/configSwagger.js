import swaggerJSDoc from "swagger-jsdoc";
import { __dirname } from '../utils.js';

const swaggerOptions ={
    definition: {
        openapi:'3.0.0',
        info:{
            title:"EntregaFinal_APIRest_CH47310 ", 
            version:"ya perdí la cuenta",
            contact: {
                name:"Proyecto Final Backend by Aranthiël",
                url:"https://github.com/Aranthiel",
                email:"nmoronidalmasso@gmail.com"
            }
        }
    }, 
    apis: [`${__dirname}/docs/Users.yaml`]
};

export const swaggerSetup = swaggerJSDoc(swaggerOptions)