import {Router} from 'express';
import {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct, 
    deleteProduct, 
} from '../controllers/products.controller.js'

const apiProductsRouter = Router();

//endpopint GET para obtener TODOS LOS PRODUCTOS
apiProductsRouter.get('/', getAllProducts); 

//endpopint GET para obtener un PRODUCTO POR SU ID
apiProductsRouter.get('/:productId', getProductById); 

//Endpoint POST para APGREGAR PRODUCTO
apiProductsRouter.post('/', addProduct ); 
// apiProductsRouter.post('/', validateProductData, addProduct ); 

//Endpoint PUT para actualizar un producto por su ID
apiProductsRouter.put('/:productId', updateProduct );
//apiProductsRouter.put('/:productId', validateUpdateProductData, updateProduct );

//Endpoint DELETE para eliminar un producto por su ID
apiProductsRouter.delete('/:productId', deleteProduct );

export default apiProductsRouter;