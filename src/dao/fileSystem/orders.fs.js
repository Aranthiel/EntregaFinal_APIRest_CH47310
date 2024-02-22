
import fs from 'fs';
import { writeDataToFile } from './fsUtils.js';
import {myCustomLogger} from '../../configs/configWinston.js'


///////////////codigo sin revisar /////////////////////////

export class OrdersFS {
    constructor(path) {        
        this.path = path;
    }

    async findById(orderId) {
        
        const uid = +orderId;
        return new Promise(async (resolve, reject) => {
            try {
                const orders = await this.findAll();
                const order = orders.find(order => order._id === uid);
                resolve(order || null);
            } catch (error) {
                reject(new Error(`Error al buscar el usuario: ${error.message}`));
            }
        });
    }

   
    async createOne(obj) {
        myCustomLogger.test('ejecutando createOne en orders.fs.js');
        
        return new Promise(async (resolve, reject) => {
            try {
                const orders = await this.findAll();
    
                if (orders.length > 0) {
                    const orderExist = orders.find(order => order._id === obj._id);
                    if (orderExist) {
                        reject(new Error(`El email de usuario ${obj._id} ya está registrado y no se puede utilizar`));
                    } else {
                        obj._id = orders[orders.length - 1]._id + 1;
                        orders.push(obj);
                        await writeDataToFile(this.path, orders); // Utiliza el array de usuarios obtenido
                        resolve(obj);
                    }
                } else {
                    obj._id = 1;
                    orders.push(obj);
                    await writeDataToFile(this.path, orders); // Utiliza el array de usuarios obtenido
                    resolve(obj);
                }
                
            } catch (error) {
                reject(new Error(`Error al crear el usuario: ${error.message}`));
            }
        });
    }
    

    async updateOne(orderId, newValue) {
        myCustomLogger.test('ejecutando updateOne en orders.fs.js')
        const uid = +orderId;
        return new Promise(async (resolve, reject) => {
            try {
                let order = await this.findById(uid);
                
                if (!order) {
                    reject(new Error('Usuario no encontrado para actualizar'));
                } else {
                    // Actualizar el usuario con los nuevos valores y mantener el ID original                    
                    order = { ...order, ...newValue, _id: uid };
    
                    // Recuperar el arreglo de usuarios
                    const orders = await this.findAll();
    
                    // Encontrar el índice del usuario en el arreglo
                    const orderIndex = orders.findIndex(u => u._id === uid);
    
                    // Crear un nuevo array con el usuario actualizado usando splice
                    orders.splice(orderIndex, 1, order);
                    
    
                    // Sobreescribir el archivo .json 
                    await writeDataToFile(this.path, orders);
    
                    // Retorna el usuario actualizado
                    resolve(order);
                }
            } catch (error) {
                reject(new Error(`Error al actualizar el usuario: ${error.message}`));
            }
        });
    }

    async deleteOne(orderId) {
        myCustomLogger.test('ejecutando deleteOne en orders.fs.js')
        const uid = +orderId;
        return new Promise(async (resolve, reject) => {
            try {
                const order = await this.findById(uid);
                if (!order) {
                    reject(new Error('Usuario no encontrado para eliminar'));
                } else {
                    // Recuperar el arreglo de usuarios
                    const orders = await this.findAll();
    
                    // Filtrar los usuarios para excluir el usuario a eliminar
                    const ordersNew = orders.filter(order => order._id !== uid);
    
                    // Sobreescribir el archivo .json con los usuarios actualizados
                    await writeDataToFile(this.path, ordersNew);
    
                    // Resolver la promesa indicando que se ha eliminado el usuario
                    resolve(true);
                }
            } catch (error) {
                reject(new Error(`Error al eliminar el usuario: ${error.message}`));
            }
        });
    }
}

