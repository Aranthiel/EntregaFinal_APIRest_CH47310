//import {productsMongo} from '../dao/mongo_dao/products.mongo.js';
/*
import {productsMongo}  from '../dao/mongo_dao/products.mongo.js';
const productsPersistence = new productsPersistence();
*/
import {productsPersistence} from '../configs/persistenceManager.js'
//winston 
import {myCustomLogger} from '../configs/configWinston.js'

class ProductsService {   

    async getAllProducts(limit){
        myCustomLogger.test('ejecutando getAllProducts en products.service.js')
        try {
            const productsList = await productsPersistence.findAllAndLimit(limit);
            
        return productsList;
        } catch (error) {
            console.error('No se encontraron productos', error);
            return error
        }
    }
        
    async getProductById(pid){
        myCustomLogger.test('ejecutando getProductById en products.service.js')
        try {
            const product = await productsPersistence.findById(pid); 
            
            
            if(!product){
                //return `ERROR:NOT FOUND. El producto ${productId} NO se encuentra en el listado de productos, por favor ingrese un producto válido`;
                myCustomLogger.error(`ERROR:NOT FOUND. El producto ${pid} NO se encuentra en el listado de productos, por favor ingrese un producto válido`);
                return null; // Devuelve null en lugar de una cadena de error
        
            } else {
                return product;
            };
            
        } catch (error) {
            console.error('No se encontró el producto solicitado', error);
            return error
        }
    };    
    
    async addProduct(obj){
        myCustomLogger.test('ejecutando addProduct en products.service.js')
        try {
            const newProduct= await productsPersistence.createOne(obj); 
            myCustomLogger.test('newProduct addProduct en products.service.js', newProduct)
            return newProduct;
        } catch (error) {
            console.error('No se pudo agregar el producto', error);
            return error
        }
    };
    
    async updateProduct(pid, obj){
        myCustomLogger.test('ejecutando updateProduct en products.service.js')        
        try {
            // Buscar el producto a actualizar por su ID
            let response = await productsPersistence.updateOne(pid, obj);

            if (!response) {
                // Producto no encontrado, devuelve null
                return null;
            }
            let product = await productsPersistence.findById(pid);
            return product;
    
        } catch (error) {
            console.error('No se logró actualizar el producto', error);
            return error;
        }
    };
        
    async deleteProduct(pid){
        myCustomLogger.test('ejecutando deleteProduct en products.service.js');
        try {
            const product = await productsPersistence.deleteOne(pid);
            return product;
        } catch (error) {
            console.error('No se logró eliminar el producto', error);
            return error;
        }
            
    };
};

export const productService = new ProductsService