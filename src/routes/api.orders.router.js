import {Router} from 'express';
import { createOrder,
    getOrderById,
    updateOrder,
    deleteOrder } from '../controllers/orders.controller.js';


const apiMailingRouter = Router();

//endpopint POST para confirmar una compra
apiMailingRouter.post('/confirmOrder', createOrder); 
//endpopint GET para confirmar una compra
apiMailingRouter.get('/orderInfo', getOrderById); 
//endpopint POST para confirmar una compra
apiMailingRouter.put('/editOrder', updateOrder); 
//endpopint POST para confirmar una compra
apiMailingRouter.delete('/deleteOrder', deleteOrder); 

export default apiMailingRouter;