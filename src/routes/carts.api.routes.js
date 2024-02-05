import {Router} from 'express';
import {
    getAllCarts,
    getCartById,
    addCart,
    updateCart, 
    deleteCart, 
} from '../controllers/carts.controller.js'

const apiCartsRouter = Router();

//endpopint GET para obtener TODOS LOS Caritos
apiCartsRouter.get('/', getAllCarts); 

//Endpoint POST para CREAR Carito
apiCartsRouter.post('/:userId', addCart ); 

//endpopint GET para obtener un Carito POR SU ID
apiCartsRouter.get('/:cartId', getCartById); 

//Endpoint PUT para actualizar un Carito por su ID
apiCartsRouter.put('/:cartId', updateCart );

//Endpoint DELETE para eliminar un Carito por su ID
apiCartsRouter.delete('/:cartId', deleteCart );


export default apiCartsRouter;