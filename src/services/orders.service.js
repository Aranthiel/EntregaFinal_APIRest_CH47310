//import {ordersMongo} from '../dao/mongo_dao/orders.mongo';
import {ordersPersistence} from '../configs/persistenceManager.js';

class OrdersService{
   

    async getOrderById(id){        
        //console.log('ejecutando getorderById en orders.service.js');
        try {
            const response = await ordersPersistence.findById(id)
            return response
        } catch (error) {
            console.error('No se encontró el usuario solicitado', error);
            return error;            
        };
    };

    
    async createOrder(obj) {
        //console.log('ejecutando createorder en orders.service.js');
        
        
        try {
            const response = await ordersPersistence.createOne(obj);
            
            return response;
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            return error;
        }
    }

    async updateOrder(id, obj) {
        //console.log('ejecutando updateorder en orders.service.js');
        try {
            const response = await ordersPersistence.updateOne(id, obj);
            
            return response;
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            return error;
        }
    }

    async deleteOrder(id) {
        //console.log('ejecutando deleteorder en orders.service.js');
        try {
            const response = await ordersPersistence.deleteOne(id);
            console.log('Usuario actualizado con éxito:', response);
            return response;
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            return error; 
        }
    }    
}

export const ordersService = new OrdersService();