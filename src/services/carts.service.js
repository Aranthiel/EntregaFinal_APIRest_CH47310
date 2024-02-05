//import {cartsMongo} from '../dao/mongo_dao/carts.mongo';
import {cartsPersistence} from '../configs/persistenceManager.js';
//winston 
import {myCustomLogger} from '../configs/configWinston.js'

class CartsService {

    async getAllCarts(limit){
        myCustomLogger.test('ejecutando getAllCarts en carts.service.js');
        try {
            const response = await cartsPersistence.findAll()
            return response;
        } catch (error) {
            console.error('No se encontraron carritos', error);
            return error;
        }
    };

    async getCartById(cid){
        myCustomLogger.test('ejecutando getCartById en carts.service.js');
        try {
            const response = await cartsPersistence.findById(cid)
            return response
        } catch (error) {
            console.error('No se encontró el carrito solicitado', error);
            return error;            
        };
    };

    async createCart(products){
        myCustomLogger.test('ejecutando createCart en carts.service.js');
        const cartProducts = {
            products: products.map(product => ({
                productoId: product.productoId,
                quantity: product.quantity
            }))
        }; 
        try {
            myCustomLogger.test('llamando al mentodo cartsPersistence.createOne(cartProducts)');
            const response = await cartsPersistence.createOne(cartProducts);
            myCustomLogger.test('Carrito creado con éxito:', response);
            return response;
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            return error;
        }
    };

    async updateCart(cartId, updateCartProducts) {
        myCustomLogger.test('ejecutando updateCart en carts.service.js');
        try {
            // Actualizar el carrito con los productos actualizados
            const response = await cartsPersistence.updateOne(cartId, { products: updateCartProducts });
    
            // Devolver los productos actualizados
            return {response, message: 'Carrito actualizado con éxito'  };
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            throw new Error(`Error al actualizar el carrito: ${error.message}`);
        }
    }
    

    async deleteCart(cid){
        myCustomLogger.test('ejecutando deleteCart en carts.service.js');
        try {
            const response = await cartsPersistence.deleteOne(cid);
            myCustomLogger.test('Carrito actualizado con éxito:', response);
            return response;
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            return error; 
        }
    };
};

export const cartsService = new CartsService();