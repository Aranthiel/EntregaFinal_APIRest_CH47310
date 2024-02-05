import { productModel } from '../../models/products.model.js';
import fs from 'fs';
import { writeDataToFile } from './fsUtils.js';
import {myCustomLogger} from '../../configs/configWinston.js'
export class ProductsFS{
    /*Debe crearse desde su contructor con el elemento products, el cual será un arreglo vacío */

    constructor(path){ 
        /* la clase debe contar con una varuiable this.path el cual se inicializara desde el contructor y debe recibir la ruta a trabajar desde el momento de generar su instancia*/
        this.path=path;       
        //this.products=[]
    };

    /* Debe contar con un metodo getProducts el cual debe devolver un arreglo vacio o el arreglo con todos los productos creados hasta el momento */
    async findAllAndLimit(limit) {
        return new Promise(async (resolve, reject) => {
            try {
                if (fs.existsSync(this.path)) {
                    const info = await fs.promises.readFile(this.path, 'utf-8');
                    let products = JSON.parse(info);
    
                    // Aplicar el límite si se proporciona
                    if (limit !== undefined && limit > 0) {
                        products = products.slice(0, limit);
                    }
                    resolve(products);
                } else {
                    resolve([]);
                }
            } catch (error) {
                reject(new Error(`Error al leer el archivo: ${error.message}`));
            }
        });
    };
    

    /* Debe contar con un metodo getProductById el cual debe buscar en el arreglo el producto que coincida con el id */
    async findById(productId) {
        const pid=+productId
        return new Promise(async (resolve, reject) => {
            try {
                const products = await this.findAllAndLimit();
                const product = products.find(product => product._id === pid);
                
                if (!product) {
                    resolve(null); // No se encontró el producto
                } else {
                    resolve(product); // Producto encontrado
                }
            } catch (error) {
                reject(new Error(`Error al buscar el producto: ${error.message}`));
            }
        });
    };    
    
    /* Debe tener un método addProduct que debe recibir un objeto con el formato previamente especificado y asignarle un id autoincrementable y guardarlo en un arreglo*/
    async createOne(obj) {
        return new Promise(async (resolve, reject) => {
            try {
                const products = await this.findAllAndLimit();
    
                // Validar que no se repita el campo code
                if (products.find(e => e.code === obj.code)) {
                    reject(new Error(`El código de producto ${obj.code} ya existe y no se puede utilizar`));
                } else {
                    // Asignar un ID autoincremental al producto
                    if (!products.length) {
                        // Si el arreglo de productos está vacío, asigna el ID 1
                        obj._id = 1;
                    } else {
                        obj._id = products[products.length - 1]._id + 1;
                    }
    
                    // Agregar el producto al arreglo
                    products.push(obj);
                    await writeDataToFile(this.path, products);
                    resolve(obj);
                }
            } catch (error) {
                reject(new Error(`Error al crear el producto: ${error.message}`));
            }
        });
    }
    
    
    async updateOne(productId, newValue) {
        const pid=+productId
        return new Promise(async (resolve, reject) => {
            try {
                // Buscar el producto a actualizar por su ID
                let product = await this.findById(pid);
                myCustomLogger.test('product updateOne en products.fs.js', product)
    
                if (!product) {
                    // Producto no encontrado, rechaza la promesa con un mensaje
                    reject(new Error('Producto no encontrado para actualizar'));
                } else {
                    // Actualizar el producto con los nuevos valores y mantener el ID original
                    product = { ...product, ...newValue, _id: pid };
    
                    // Recuperar el arreglo de productos
                    const products = await this.findAllAndLimit();
    
                    // Encontrar el índice del producto en el arreglo
                    const productIndex = products.findIndex(p => p._id === pid);
    
                    // Crear un nuevo array con el producto actualizado usando splice
                    products.splice(productIndex, 1, product);
    
                    // Sobreescribir el archivo .json 
                    await writeDataToFile(this.path, products);
    
                    // Retorna el producto actualizado
                    resolve(product);
                }
            } catch (error) {
                reject(new Error(`Error al actualizar el producto: ${error.message}`));
            }
        });
    }
    
    
    
    async deleteOne(productId) {
        const pid=+productId
        return new Promise(async (resolve, reject) => {
            try {
                // Verificar la existencia del producto
                const product = await this.findById(pid);
    
                // Si el producto no existe, rechaza la promesa con un mensaje
                if (!product) {
                    reject(new Error('Producto no encontrado para eliminar'));
                } else {
                    // Recuperar el arreglo de productos
                    const products = await this.findAllAndLimit();
    
                    // Filtrar los productos para excluir el producto a eliminar
                    const productsNew = products.filter(prod => prod._id !== pid);
    
                    // Sobreescribir el archivo .json con los productos actualizados
                    await writeDataToFile(this.path, productsNew);
    
                    // Resolver la promesa indicando que se ha eliminado el producto
                    resolve(true);
                }
            } catch (error) {
                // Manejar cualquier error durante el proceso y rechazar la promesa con un mensaje
                reject(new Error(`Error al eliminar el producto: ${error.message}`));
            }
        });
    }
    
};

