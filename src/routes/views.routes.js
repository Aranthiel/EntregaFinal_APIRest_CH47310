import {Router} from 'express';
import {    
    renderHome,
    renderSignup,
    renderLogin,
    renderChat,
    renderRealTimeProducts,
    renderCartDetail,
    renderProductDetail
} from '../controllers/views.controller.js'



const viewsRouter = Router();
viewsRouter.get('/', renderHome ); //listo
viewsRouter.get('/home', renderHome ); //listo
viewsRouter.get ('/login', renderLogin ) //listo
viewsRouter.get ('/signup', renderSignup ); //listo
viewsRouter.get('/chat', renderChat ); //listo
viewsRouter.get('/realtimeproducts', renderRealTimeProducts); //listo
viewsRouter.get('/cart/:cid', renderCartDetail); //listo
viewsRouter.get('/products/:pid', renderProductDetail ); //listo


export default viewsRouter;