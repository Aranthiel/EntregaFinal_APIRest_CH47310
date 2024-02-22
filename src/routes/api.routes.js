import {Router} from 'express';
import apiUsersAuth from './auth.api.routes.js';
import apiCartsRouter from './carts.api.routes.js';
import apiProductsRouter from './products.api.routes.js';
import apiUsersRouter from './users.api.routes.js';
import apiMailingRouter from './api.mailing.router.js';
import apiOrdergRouter from './api.orders.router.js';



const apiRouter = Router();
apiRouter.use('/auth', apiUsersAuth);
apiRouter.use('/carts', apiCartsRouter);
apiRouter.use('/products', apiProductsRouter);
apiRouter.use('/users', apiUsersRouter);
apiRouter.use ('/messages', apiMailingRouter)
apiRouter.use ('/orders', apiOrdergRouter)


export default apiRouter;