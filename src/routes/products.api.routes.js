import {Router} from 'express';
import {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct, 
    deleteProduct, 
} from '../controllers/products.controller.js'
import authenticateToken from '../middleware/authenticateToken.middleware.js';


const apiProductsRouter = Router();

//endpopint GET para obtener TODOS LOS PRODUCTOS
apiProductsRouter.get('/', getAllProducts); 

//endpopint GET para obtener un PRODUCTO POR SU ID
apiProductsRouter.get('/:productId', getProductById); 

//Endpoint POST para APGREGAR PRODUCTO
apiProductsRouter.post('/', authenticateToken, addProduct ); 
// apiProductsRouter.post('/', validateProductData, addProduct ); 

//Endpoint PUT para actualizar un producto por su ID
apiProductsRouter.put('/:productId', authenticateToken, updateProduct );
//apiProductsRouter.put('/:productId', validateUpdateProductData, updateProduct );

//Endpoint DELETE para eliminar un producto por su ID
apiProductsRouter.delete('/:productId', authenticateToken, deleteProduct );

export default apiProductsRouter;