import { cartsService } from '../services/carts.service.js';
import { productService } from '../services/products.service.js'; // al crear un carrito
import { usersService } from '../services/users.service.js'; //al crear un carrito
import config from '../configs/config.js';
//winston
import { myCustomLogger} from '../configs/configWinston.js';


async function verifyProducts(products) {
    console.log("verifyProducts")
    const invalidProducts = [];
    const validProducts = [];
    
    for (const product of products) {
        const isValid = await productService.getProductById(product.productId);
        

        if(isValid && isValid._id) {
            validProducts.push(product);
        } else {
            invalidProducts.push(product);
        }
        
    }

    return { invalidProducts, validProducts };
}

async function updateCartProducts(cartId, products){
    //obtener los productos actuales del carrito por su id
   
    try {
        const carritoDB = await cartsService.getCartById(cartId);
            
        // Crear un objeto que mapee cada producto por su ID
        const currentProductsMap = {};
        carritoDB.products.forEach(product => {
            if (product.productId) { // Verificar si el productId está definido
                currentProductsMap[product.productId] = product.quantity;
            }
        });

        // Iterar sobre los productos nuevos y actualizar el mapa de productos actuales
        products.forEach(product => {
            if (product.productId) { // Verificar si el productId está definido
                currentProductsMap[product.productId] = product.quantity;
            }
        });
        

        // Crear un nuevo array con los objetos de productos y cantidades actualizadas
        const updatedProducts = Object.keys(currentProductsMap).map(productId => ({
            productId,
            quantity: currentProductsMap[productId]
        }));
        
        
        const updatedCart = await cartsService.updateCart(cartId, updatedProducts);
        return updatedCart
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        throw error;
    }
}

//funcion intermedia entre router y manager metodo GET para obtener TODOS LOS carritoS
async function getAllCarts(req, res){
    myCustomLogger.test('ejecutando getAllCarts en carts.controller.js')
    const limit = req.query.limit ? req.query.limit : undefined;   

    try {
        const carts = await cartsService.getAllCarts(limit);
        if (!carts.length) {
            res.status(404).json({ success: false, message: 'No se encontraron carritos'})        
        } else {
            res.status(200).json({success: true, message: 'Carritos encontrados con éxito:', carts})
            return carts;
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
} //funciona OK 12/02


//funcion intermedia entre router y manager metodo GET para obtener un carrito POR SU ID
async function getCartById (req, res){
    myCustomLogger.test('ejecutando getCartById en carts.controller.js')
    const {cartId}=req.params; 
        
    try {        
        const cartById = await cartsService.getCartById(cartId);
        if (cartById){
            res.status(200).json({success: true, message: 'Carrito encontrado con éxito:', cartById})
            return cartById;
        } else {
            res.status(404).json({ success: false, message: 'No se encontró el Id de carrito solicitado'})
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}; 

async function addProductToCart(req, res) {
    
    const { userId } = req.params; // Obtener el ID de usuario de la solicitud
    const { products } = req.body; // obtener los productos

    
    //verifica que los productos existan
    const existingProducts = await verifyProducts(products);
    console.log(existingProducts.validProducts)

    try {
        if (userId !== "nouser") {
            console.log('se va actualizar el carrito del usuario: ', userId)
            // Si hay un ID de usuario en la solicitud, el usuario está autenticado
            // Verificar si el usuario existe
            const user = await usersService.getUserById(userId);            
            
            if (!user) {
                return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
            }

            // Obtener el carrito asociado a este usuario
            const cartId = user.cart;
            console.log("Es el carrito id:", cartId)
            if(!cartId){
                res.status(404).json({ success: false, message: 'No se pudo agregar el carrito solicitado' });
            }

            const carritoActualizado = await updateCartProducts(cartId, existingProducts.validProducts);
            //obtener el carrito por su id
            const carritoUsuario = await cartsService.getCartById(cartId);

            // Una vez que se hayan agregado los productos al carrito, enviar una respuesta adecuada
            res.status(200).json({ success: true, message: 'Productos agregados al carrito con éxito', carritoUsuario });
        

        } else {
            // Si no hay un ID de usuario en la solicitud, el usuario no está autenticado
            console.log('no se envió información de un usuario')
            
            // Crear un nuevo carrito temporal con los productos verificados
            const carritoTemporal = await cartsService.createCart(existingProducts.validProducts);
            
            // Una vez que se hayan agregado los productos al carrito, enviar una respuesta adecuada
            res.status(200).json({ success: true, message: 'Productos agregados al carrito con éxito', carritoTemporal });
        }

        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

//funcion intermedia entre router y manager metodo PUT para actualizar un carrito por su ID
async function updateCart (req , res){
    myCustomLogger.test('ejecutando updateCart en carts.controller.js')    
    const {cartId}=req.params;  // Obtener el ID de usuario de la solicitud
    const newValues= req.body; // obtener los productos

    console.log('productos recibidos en updateCart', newValues)
    //verifica que los productos existan
    const existingProducts = await verifyProducts(newValues.products)
    console.log(existingProducts.validProducts)
    try {
        const carritoActualizado = await updateCartProducts(cartId, existingProducts.validProducts);
        //obtener el carrito por su id
        const carritoUsuario = await cartsService.getCartById(cartId);
        res.status(200).json({success: true, message: 'Carrito actualizado con éxito:', carritoUsuario});
        

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}; 

async function deleteCart(req , res){
    myCustomLogger.test('ejecutando deletecart en carts.controller.js')
    const {cartId}=req.params;
    try {
        const deletedCart = await cartsService.deleteCart(cartId);
        if (deletedCart) {
            res.status(200).json({success: true, message: 'Carrito eliminado con éxito:', deletedCart}); 
        } else {
            res.status(404).json({ success: false, message: 'No se encontró el Id de carrito solicitado'});
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
} 


export {
    getAllCarts, 
    getCartById,
    addProductToCart,
    updateCart,
    deleteCart
}