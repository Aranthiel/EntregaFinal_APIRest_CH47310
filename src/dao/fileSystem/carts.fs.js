import { cartModel } from '../../models/carts.model.js';
import fs from 'fs';
import { writeDataToFile } from './fsUtils.js';
//winston 
import {myCustomLogger} from '../../configs/configWinston.js'

export class CartsFS {
    constructor(path) {     
        this.path = path;
    }

    async findAll() {
        myCustomLogger.test('ejecutando findAll en carts.fs.js')
        return new Promise(async (resolve, reject) => {
            try {
                if (fs.existsSync(this.path)) {
                    const info = await fs.promises.readFile(this.path, 'utf-8');
                    let carts = JSON.parse(info);
                    
                    resolve(carts);

                } else {
                    resolve([]);
                }
            } catch (error) {
                reject(new Error(`Error al leer el archivo: ${error.message}`));
            }
        });
    }

    async findById(cartId) {
        myCustomLogger.test('ejecutando findById en carts.fs.js')
        const cid = +cartId;
        return new Promise(async (resolve, reject) => {
            try {
                const carts = await this.findAll();
                const cart = carts.find(cart => cart._id === cid);
                
                resolve(cart || null);
            } catch (error) {
                reject(new Error(`Error al buscar el carrito: ${error.message}`));
            }
        });
    }

    async createOne(obj) {
        myCustomLogger.test('ejecutando createOne en carts.fs.js');
        
        return new Promise(async (resolve, reject) => {
            try {
                const carts = await this.findAll();
                const newCart = { _id: "", products: obj.products }
                
                if (carts.length > 0) {
                    newCart._id = carts[carts.length - 1]._id + 1;
                } else {
                    newCart._id = 1;
                }

                carts.push(newCart);
                await writeDataToFile(this.path, carts); // Utiliza el array de carritos obtenido
                resolve(newCart);
                
            } catch (error) {
                reject(new Error(`Error al crear el carrito: ${error.message}`));
            }
        });
    }
    
    async updateOne(cartId, newValue) {
        myCustomLogger.test('ejecutando updateOne en carts.fs.js');
        const cid = +cartId;
    
        try {
            let cart = await this.findById(cid);
    
            if (!cart) {
                throw new Error('Carrito no encontrado para actualizar');
            } else {
                myCustomLogger.test('updateOne else cart antes de combinar', cart);
                myCustomLogger.test('updateOne else newValue antes de combinar', newValue);
    
                // Actualizar el carrito con los nuevos valores y mantener el ID original                    
                newValue.products.forEach(newProduct => {
                    const existingProduct = cart.products.find(existingProd => existingProd._id === newProduct._id);
                    if (!existingProduct) {
                        // Si el producto no existe en el carrito, agregarlo
                        cart.products.push(newProduct);
                    } else {
                        // Si el producto ya está en el carrito, actualiza la cantidad
                        existingProduct.quantity += newProduct.quantity;
                        // Aquí también puedes actualizar otros detalles del producto si es necesario
                    }
                });
    
                myCustomLogger.test('updateOne else cart combinado', cart);
    
                // Recuperar el arreglo de carritos
                const carts = await this.findAll();
    
                // Encontrar el índice del carrito en el arreglo
                const cartIndex = carts.findIndex(c => c._id === cid);
    
                // Crear un nuevo array con el carrito actualizado usando splice
                carts.splice(cartIndex, 1, cart);
    
                // Sobreescribir el archivo .json 
                await writeDataToFile(this.path, carts);
    
                // Retorna el carrito actualizado
                return cart;
            }
        } catch (error) {
            throw new Error(`Error al actualizar el carrito: ${error.message}`);
        }
    }
    

    async deleteOne(cartId) {
        myCustomLogger.test('ejecutando deleteOne en carts.fs.js')
        const cid = +cartId;
        return new Promise(async (resolve, reject) => {
            try {
                const cart = await this.findById(cid);
                if (!cart) {
                    reject(new Error('Carrito no encontrado para eliminar'));
                } else {
                    // Recuperar el arreglo de carritos
                    const carts = await this.findAll();
    
                    // Filtrar los carritos para excluir el carrito a eliminar
                    const cartsNew = carts.filter(c => c._id !== cid);
    
                    // Sobreescribir el archivo .json con los productos actualizados
                    await writeDataToFile(this.path, cartsNew);
    
                    // Resolver la promesa indicando que se ha eliminado el producto
                    resolve(true);
                }
            } catch (error) {
                reject(new Error(`Error al eliminar el carrito: ${error.message}`));
            }
        });
    }
}
