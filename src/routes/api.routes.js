import {Router} from 'express';
import apiUsersAuth from './auth.api.routes.js';
import apiCartsRouter from './carts.api.routes.js';
import apiProductsRouter from './products.api.routes.js';
import apiUsersRouter from './users.api.routes.js';



const apiRouter = Router();
apiRouter.use('/auth', apiUsersAuth);
apiRouter.use('/carts', apiCartsRouter);
apiRouter.use('/products', apiProductsRouter);
apiRouter.use('/users', apiUsersRouter);


export default apiRouter;