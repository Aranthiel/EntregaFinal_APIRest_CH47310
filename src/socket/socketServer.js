import { Server } from 'socket.io'; // Para gestionar las conexiones de WebSocket

import { chatModel } from '../models/chats.model.js';
import config from '../config/config.js';
//winston 
import {myCustomLogger} from '../config/configWinston.js'


const PORT = config.port || 8080; // Si no hay variable PORT definida, usa 8080 por defecto
const BASE_URL = config.baseURL;

let socketServer;
export function initializeSocket(server) {
    socketServer = new Server(server)

    const names =[];
    const messages=[];

    // connection - disconnect
    // eventos predeterminados de socket.io  


    socketServer.on("connection", async (socket) => {
        myCustomLogger.info(`se ha conectado el cliente ${socket.id}`);

        const productosIniciales = await getAllProductsSocket();
        socket.emit('productosInicialesRT', productosIniciales);
        
        // Handle Chat Functionality
        handleChat(socket);

        // Handle Real-Time Products Functionality
        handleRealTimeProducts(socket);
        
        // Handle Disconnect
        socket.on("disconnect", () => {
            myCustomLogger.info(`cliente desconectado ${socket.id}`);
        });
    });

    // CHAT funciona perfecto, no tocar 29/10/2023 2:00am
    async function handleChat(socket) {
        socket.on("newChatUser", (user) => {
            socket.broadcast.emit('newChatUserBroadcast', user);
        });

        socket.on("newChatMessage", (info) => {
            myCustomLogger.test('Mensaje recibido:', info);
            
            const newMessage = new chatModel({
                name: info.name,
                message: info.message
            });
        
            myCustomLogger.test('Nuevo mensaje a guardar:', newMessage);
        
            newMessage
                .save()
                .then(savedMessage => {
                    myCustomLogger.test('Mensaje guardado con éxito. ID:', savedMessage._id);
                    messages.push(info);
                    socketServer.emit('chatMessages', messages);
                })
                .catch(error => {
                    console.error('Error al guardar el mensaje:', error);
                });
        });
    } 

    // RealTimeProducts funciona perfecto, no tocar 29/10/2023 2:00am
    async function getAllProductsSocket() {
        try {
            const response = await fetch(`${BASE_URL}/api/products/`);
            if (response.ok) {
                const productos = await response.json();
                return productos;
            } else {
                console.error("Error al obtener productos: ", response.status, response.statusText);
                return [];
            }
        } catch (error) {
            console.error("Error al obtener productos:", error);
            return [];
        }
    }

    async function handleRealTimeProducts(socket) {
        
        //funcion para hacer fetch a `${BASE_URL}/api/products/` y devolver una response de forma de reemplazar getAllProductsC por esta funcion en el resto del codigo

        socket.on('addProduct', async (nProduct) => {
            myCustomLogger.test('Evento "addProduct" recibido en el servidor con los siguientes datos:', nProduct);
            
            const newProductData = {
                title: nProduct.title,
                price: nProduct.price,
                status: nProduct.status,
                category: nProduct.category,
                code: nProduct.code,
                stock: nProduct.stock
            };

            try {
                const response = await fetch(`${BASE_URL}/api/products/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newProductData)
                });

                if (response.ok) {
                    // Emite la lista actualizada de productos a todos los clientes
                    const productosActualizados = await getAllProductsSocket();
                    socketServer.emit('productsUpdated', productosActualizados);
                } else {
                    console.error("Error al agregar el producto: ", response.status, response.statusText);
                }
            } catch (error) {
                console.error("Error al agregar el producto:", error);
            }
        });
        

        socket.on('borrar', async (selectedProductIds) => {
            myCustomLogger.test('Evento "borrar" recibido en el servidor con los siguientes datos:', selectedProductIds);
            try {
                for (const productId of selectedProductIds) {
                    try {
                        const response = await fetch(`${BASE_URL}/api/products/${productId}`, {
                            method: 'DELETE'
                        });

                        if (!response.ok) {
                            console.error("Error al eliminar el producto: ", response.status, response.statusText);
                        }
                    } catch (error) {
                        console.error("Error al eliminar el producto:", error);
                    }
                }

                myCustomLogger.test('Todas las eliminaciones se completaron con éxito');
                const productosActualizados = await getAllProductsSocket();
                socketServer.emit('productsUpdated', productosActualizados);
            } catch (error) {
                console.error('Error durante la eliminación:', error);
            }
        });
    };

};



