import { cartsService } from '../services/carts.service.js';
import { productService } from '../services/products.service.js'; // al crear un carrito
import { usersService } from '../services/users.service.js'; //al crear un carrito
import config from '../configs/config.js';
//winston
import { myCustomLogger} from '../configs/configWinston.js';

const persistencia=config.persistencia
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
} //funciona OK 2/12

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

async function associateCartToUser(userId, cartId) {
    myCustomLogger.test('Ejecutando associateCartToUser en carts.controller.js');
    try {
        const updatedUser = await usersService.updateUser(userId, { cart: cartId });
        myCustomLogger.test('updatedUser', updatedUser)
        return updatedUser;
    } catch (error) {
        throw new Error(`Error al asociar el carrito al usuario: ${error.message}`);
    }
} // funciona ok 5/12

async function verifyUser(userId) {
    myCustomLogger.test('Ejecutando verifyUser en carts.controller.js');
    const isValid = await usersService.getUserById(userId);        
        
        if (isValid) {
            myCustomLogger.test('usuario verificado OK')
            return true
        } else {
            myCustomLogger.info('El usuario no existe')
            return false
        }
}// funciona ok 5/12

async function verifyProducts(products) {
    
    myCustomLogger.test('Ejecutando verifyProducts en carts.controller.js');
    const invalidProducts = [];
    const validProducts = [];
    myCustomLogger.test(`Has seleccionado la presistencia ${persistencia}`)
    
    for (const product of products) {
        const isValid = await productService.getProductById(product.productoId);
        

        if(isValid && isValid._id) {
            validProducts.push(product);
        } else {
            invalidProducts.push(product);
        }
        
    }
    myCustomLogger.test('validProducts',validProducts, 'invalidProducts', invalidProducts)

    return { invalidProducts, validProducts };
} // funciona ok 5/12

//funcion intermedia entre router y manager metodo POST para Crear un carrito, necesita un id de usuario y tener productos agregados
//sirve para cuando el usuario no registrado agrega productos a un carrito???... no no sirve para esto :/
async function addCart(req, res) {
    myCustomLogger.test('Ejecutando addCart en carts.controller.js');
    const { userId } = req.params;
    const { products } = req.body;
    
    try {
        
        const existingProducts = await verifyProducts(products);
        const userExist = await verifyUser(userId);
        //console.log('userExist', userExist)
        if(userExist && existingProducts.validProducts.length>0){
            const carritoCreado = await cartsService.createCart(existingProducts.validProducts);
            myCustomLogger.test('carritoCreado', carritoCreado)
        
            if (carritoCreado && carritoCreado._id) {
                let responseMessage = `Carrito creado exitosamente y asociado al usuario ${userId}.`;
                
                associateCartToUser(userId, carritoCreado._id)
                if (existingProducts.invalidProducts.length > 0) {
                    responseMessage += ` ${existingProducts.invalidProducts.length} productos no fueron incluidos ya que no existen en la base de datos.`;
                }

                req.session.cart = carritoCreado._id;
                res.cookie('cart,',carritoCreado._id, {maxAge:900000, httpOnly:true});
    
                res.status(200).json({ success: true, message: responseMessage, carritoCreado });
            } else {
                res.status(404).json({ success: false, message: 'No se pudo agregar el carrito solicitado' });
            }
        }else {
            res.status(404).json({ success: false, message: 'No se pudo agregar el carrito solicitado' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
} // funciona ok 5/12

//funcion intermedia entre router y manager metodo PUT para actualizar un carrito por su ID
async function updateCart (req , res){
    myCustomLogger.test('ejecutando updateCart en carts.controller.js')    
    const {cartId}=req.params;
    const newValues= req.body;
    try {        
        const existingProducts = await verifyProducts(newValues.products)
        const newCartProducts =existingProducts.validProducts;
        if(newCartProducts.length>0){
            const response = await cartsService.updateCart(cartId, newCartProducts);
        
            if(response != null){
                let responseMessage = `Carrito actualizado.`;
                
                if (existingProducts.invalidProducts.length > 0) {
                    responseMessage += ` ${existingProducts.invalidProducts.length} productos no fueron incluidos ya que no existen en la base de datos.`;
                }
                res.status(200).json({success: true, message: 'Carrito actualizado con éxito:', response});
            } else {
                res.status(404).json({ success: false, message: 'No se encontró el Id de carrito solicitado'});
            }
        }else{
            res.status(404).json({ success: false, message: 'No se actualizó el carrito. Verifique que los productos sean válidos'});
            
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}; 

//funcion intermedia entre router y manager metodo DELETE para eliminar un carrito por su ID
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
} // funciona ok 5/12


export {
    getAllCarts,
    getCartById,
    addCart,
    updateCart,
    deleteCart,
}