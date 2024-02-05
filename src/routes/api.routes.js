import {Router} from 'express';
import apiUsersAuth from './auth.api.routes.js';
import apiCartsRouter from './carts.api.routes.js';
import apiProductsRouter from './products.api.routes.js';
import apiUsersRouter from './users.api.routes.js';
//import swaggerUi from 'swagger-ui-express'
//import {swaggerSetup} from '../configs/configSwagger.js';




const apiRouter = Router();
/* apiRouter.use('/',  async (req, res) => {
    console.log(req.body)
    res.status(200).send('Se encontró la ruta /api ')    
    //res.status(200).send('Se encontró la ruta /api ').json({ success: true, message: 'Se encontró la ruta /api '})     
}); */
apiRouter.use('/auth', apiUsersAuth);
apiRouter.use('/carts', apiCartsRouter);
//apiRouter.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSetup));
apiRouter.use('/products', apiProductsRouter);
apiRouter.use('/users', apiUsersRouter);


export default apiRouter;