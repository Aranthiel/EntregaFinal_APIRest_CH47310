// src/controllers/auth.controller.js
import { userModel } from '../models/users.models.js';
import { addUser } from './users.controller.js';
import {usersPersistence} from '../configs/persistenceManager.js';
import { compareData } from '../utils.js';
import jwt from 'jsonwebtoken';
//variables de entorno
import config from '../configs/config.js'

export const registerUser = async (req, res) => {
    try {
        const {  email} = req.body;

        // Verifica si el correo electrónico ya está registrado
        const existingUser = await usersPersistence.findByEmail(email);

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'El correo electrónico ya está registrado' });
        }

        // Agrega los datos del usuario al cuerpo de la solicitud
        req.body = {
            ...req.body,            
        };
        // Llama al método addUser pasando req y res, este metodo se ocupa de hashear la contraseña
        console.log(' registro deriva a addUser')
        await addUser(req, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`se esta intentando loguear al usuario ${email} con la contraseña ${password}`)

        // Busca al usuario por correo electrónico
        const user = await usersPersistence.findByEmail( email );
        console.log(`se ha encontraso al usuario ${user}`)
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }
        
        
        // Compara la contraseña proporcionada con la almacenada en la base de datos
        const passwordMatch = await compareData(password, user.password);
        
        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }
        
        // Almacenar la información de la sesión
        req.session.user = { userId: user._id, email: user.email, first_name: `${user.first_name} ${user.last_name}`, cart: user.cart };

        // Genera un token JWT
        const token = jwt.sign({ userId: user._id, email: user.email }, config.jwt_secret, {
            expiresIn: '1h',
        });
        
        // Devuelve el token y otros detalles del usuario si es necesario
        res.status(200).json({ success: true, token, user: {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            from_github: user.from_github,
            cart: user.cart,
            _id: user._id,
        } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const logoutUser = async (req, res)=>{
    try {
        // Eliminar la sesión del usuario
        req.session.destroy();
        
        // Devolver una respuesta exitosa
        res.status(200).json({ success: true, message: 'Sesión cerrada correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
    }
}