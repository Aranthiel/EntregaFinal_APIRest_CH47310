import { usersService } from '../services/users.service.js';
import {newEmptyCart} from '../middleware/newEmptyCart.middleware..js'
//winston 
import {myCustomLogger} from '../configs/configWinston.js'


//funcion intermedia entre router y manager metodo GET para obtener TODOS LOS usuarioS
async function getAllUsers(req, res){
    myCustomLogger.test('ejecutando getAllUsers en users.controller.js')
    const limit = req.query.limit ? req.query.limit : undefined;   

    try {
        const users = await usersService.getAllUsers(limit);
        if (!users.length) {
            res.status(404).json({ success: false, message: 'No se encontraron usuarios'})        
        } else {
            res.status(200).json({success: true, message: 'Usuarios encontrados con éxito:', users})
            return users;
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
} //funciona OK 2/12

//funcion intermedia entre router y manager metodo GET para obtener un usuario POR SU ID
async function getUserById (req, res){
    myCustomLogger.test('ejecutando getUserById en users.controller.js')
    const {userId}=req.params; 
        
    try {        
        const userById = await usersService.getUserById(userId);
        if (userById){
            res.status(200).json({success: true, message: 'Usuario encontrado con éxito:', userById})
            return userById;
        } else {
            res.status(404).json({ success: false, message: 'No se encontró el Id de usuario solicitado'})
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}; //funcionaOK 3/12

//funcion intermedia entre router y manager metodo GET para obtener un usuario POR SU email
async function getUserByEmail (req, res){
    console.log('ejecutando getUserByEmail en users.controller.js')
    //myCustomLogger.test('ejecutando getUserByEmail en users.controller.js')
    const {userEmail}=req.params; 
    console.log('email:', userEmail)
        
    try {        
        const userByEmail = await usersService.getUserByEmail(userEmail);
        if (userByEmail){
            res.status(200).json({success: true, message: 'Usuario encontrado con éxito:', userByEmail})
            return userByEmail;
        } else {
            res.status(404).json({ success: false, message: 'No se encontró el email de usuario solicitado'})
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}; 

//funcion intermedia entre router y manager metodo POST para APGREGAR usuario
async function addUser (req, res){
    myCustomLogger.test('ejecutando addUser en users.controller.js')   
    const userInfo= req.body    
    const emptyCartId= await newEmptyCart();    
    const nuevoUsuario = {
        ...userInfo,  // Spread properties of userInfo
        cart: emptyCartId // Add cartId property
    };
    
    try {
        const usuarioAgregado = await usersService.createUser(nuevoUsuario);
        if (usuarioAgregado instanceof Error){
            res.status(404).json({ success: false, message: 'No se pudo agregar el usuario solicitado'});
        return usuarioAgregado; 
        } else {
            res.status(200).json({success: true, message: 'Usuario agregado con éxito:', usuarioAgregado});
            }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }   
}; //funcionaOK 4/02

//funcion intermedia entre router y manager metodo PUT para actualizar un usuario por su ID
async function updateUser (req , res){
    myCustomLogger.test('ejecutando updateUser en users.controller.js')    
    const {userId}=req.params;
    const newValues= req.body;
    try {
        const response = await usersService.updateUser(userId, newValues);
        
        if(response != null){
            res.status(200).json({success: true, message: 'Usuario actualizado con éxito:', response});
        } else {
            res.status(404).json({ success: false, message: 'No se encontró el Id de usuario solicitado'});
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}; //funcionaOK 3/12

//funcion intermedia entre router y manager metodo DELETE para eliminar un usuario por su ID
async function deleteUser(req , res){
    myCustomLogger.test('ejecutando deleteUser en users.controller.js')
    const {userId}=req.params;
    try {
        const deleteduser = await usersService.deleteUser(userId);
        if (deleteduser) {
            res.status(200).json({success: true, message: 'Usuario eliminado con éxito:', deleteduser}); 
        } else {
            res.status(404).json({ success: false, message: 'No se encontró el Id de usuario solicitado'});
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
} //funcionaOK 3/12


export {
    getAllUsers,
    getUserById,
    getUserByEmail,
    addUser,
    updateUser,
    deleteUser,
}